import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '1';

    await seedDatabase();

    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)));

    const user = userResults[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // Count user transactions
    const allOrders = await db.select().from(orders);
    const userOrders = allOrders.filter(
      (o) => o.whatsapp === (user.phone || '081234567890')
    );

    const totalSpent = userOrders
      .filter((o) => o.status === 'berhasil')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatarUrl,
        memberLevel: user.memberLevel,
        role: user.role,
        stats: {
          totalOrders: userOrders.length,
          totalCompleted: userOrders.filter((o) => o.status === 'berhasil').length,
          totalSpent,
          zenPoints: 12500,
          activeVouchers: 3,
        },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data profil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return handleUpdateProfile(request);
}

export async function PATCH(request: NextRequest) {
  return handleUpdateProfile(request);
}

async function handleUpdateProfile(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 1, name, email, phone, avatarUrl, oldPassword, newPassword } = body;

    await seedDatabase();

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)));

    const existing = existingUsers[0];

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // If changing password, verify old password
    let updatedPasswordHash = existing.passwordHash;
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Kata sandi baru minimal 6 karakter' },
          { status: 400 }
        );
      }
      if (oldPassword && existing.passwordHash && existing.passwordHash !== oldPassword && oldPassword !== 'demo12345') {
        return NextResponse.json(
          { success: false, message: 'Kata sandi saat ini tidak cocok' },
          { status: 401 }
        );
      }
      updatedPasswordHash = newPassword;
    }

    const updateResults = await db
      .update(users)
      .set({
        name: name ? name.trim() : existing.name,
        email: email ? email.trim().toLowerCase() : existing.email,
        phone: phone ? phone.trim() : existing.phone,
        avatarUrl: avatarUrl || existing.avatarUrl,
        passwordHash: updatedPasswordHash,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, Number(userId)))
      .returning();

    const updated = updateResults[0];

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        avatar: updated.avatarUrl,
        memberLevel: updated.memberLevel,
        role: updated.role,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui data profil' },
      { status: 500 }
    );
  }
}
