import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { items, games } from '@/db/schema';
import { eq, min } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function POST(request: NextRequest) {
  try {
    await seedDatabase();

    const body = await request.json();
    const { rows } = body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Data baris Excel tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Fetch all games to map slug/name to id
    const allGames = await db.select().from(games);
    const gameMapBySlug: Record<string, any> = {};
    const gameMapByName: Record<string, any> = {};

    for (const g of allGames) {
      gameMapBySlug[g.slug.toLowerCase().trim()] = g;
      gameMapByName[g.name.toLowerCase().trim()] = g;
    }

    const insertedItems: any[] = [];
    const skippedErrors: string[] = [];
    const affectedGameIds = new Set<number>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // Accounting for header row

      const rawGame = (row.gameSlug || row.game || row.gameName || '').toString().toLowerCase().trim();
      const rawName = (row.name || row.nama || row.itemName || '').toString().trim();
      const rawNominal = Number(row.nominal || row.jumlah || 0);
      const rawPrice = Number(row.price || row.harga || row.hargaJual || 0);
      const rawOriginalPrice = row.originalPrice || row.hargaCoret || row.hargaAsli;
      const rawCostPrice = Number(row.costPrice || row.hargaModal || row.modal || 0);
      const isPopular =
        row.isPopular === true ||
        row.isPopular === 1 ||
        String(row.isPopular).toLowerCase() === 'ya' ||
        String(row.isPopular).toLowerCase() === 'true';

      if (!rawGame) {
        skippedErrors.push(`Baris ${rowNum}: Kolom Game (slug atau nama game) kosong.`);
        continue;
      }

      const targetGame = gameMapBySlug[rawGame] || gameMapByName[rawGame];
      if (!targetGame) {
        skippedErrors.push(`Baris ${rowNum}: Game '${rawGame}' tidak ditemukan di katalog.`);
        continue;
      }

      if (!rawName) {
        skippedErrors.push(`Baris ${rowNum}: Nama item tidak boleh kosong.`);
        continue;
      }

      if (rawPrice <= 0) {
        skippedErrors.push(`Baris ${rowNum}: Harga jual harus lebih dari 0.`);
        continue;
      }

      // Insert item
      const newRecord = await db
        .insert(items)
        .values({
          gameId: targetGame.id,
          name: rawName,
          nominal: rawNominal > 0 ? rawNominal : rawPrice,
          price: rawPrice,
          originalPrice: rawOriginalPrice ? Number(rawOriginalPrice) : null,
          costPrice: rawCostPrice > 0 ? rawCostPrice : Math.round(rawPrice * 0.9),
          currency: 'IDR',
          isPopular: isPopular,
          isActive: true,
        })
        .returning();

      insertedItems.push(newRecord[0]);
      affectedGameIds.add(targetGame.id);
    }

    // Recalculate minPrice for all affected games
    for (const gId of Array.from(affectedGameIds)) {
      const activeGameItems = await db
        .select({ minP: min(items.price) })
        .from(items)
        .where(eq(items.gameId, gId));

      const newMin = activeGameItems[0]?.minP || 1000;
      await db.update(games).set({ minPrice: newMin }).where(eq(games.id, gId));
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mengimpor ${insertedItems.length} item dari file Excel!`,
      insertedCount: insertedItems.length,
      skippedCount: skippedErrors.length,
      errors: skippedErrors,
    });
  } catch (error: any) {
    console.error('Error bulk importing items:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengimpor produk Excel', error: error.message },
      { status: 500 }
    );
  }
}
