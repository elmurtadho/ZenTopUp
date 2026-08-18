import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notificationSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';

export async function GET(request: NextRequest) {
  try {
    await seedDatabase();

    let settings = db.select().from(notificationSettings).get();

    // If no row exists yet, insert default settings
    if (!settings) {
      settings = db
        .insert(notificationSettings)
        .values({
          userId: 1,
          whatsappTxStatus: true,
          whatsappPromo: false,
          emailReceipt: true,
          emailNewsletter: false,
          inappOrderUpdate: true,
          inappMaintenance: true,
        })
        .returning()
        .get();
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil pengaturan notifikasi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return handleUpdate(request);
}

export async function PUT(request: NextRequest) {
  return handleUpdate(request);
}

async function handleUpdate(request: NextRequest) {
  try {
    const body = await request.json();
    await seedDatabase();

    let existing = db.select().from(notificationSettings).get();

    let updated;
    if (existing) {
      updated = db
        .update(notificationSettings)
        .set({
          whatsappTxStatus:
            body.whatsappTxStatus !== undefined
              ? body.whatsappTxStatus
              : existing.whatsappTxStatus,
          whatsappPromo:
            body.whatsappPromo !== undefined
              ? body.whatsappPromo
              : existing.whatsappPromo,
          emailReceipt:
            body.emailReceipt !== undefined
              ? body.emailReceipt
              : existing.emailReceipt,
          emailNewsletter:
            body.emailNewsletter !== undefined
              ? body.emailNewsletter
              : existing.emailNewsletter,
          inappOrderUpdate:
            body.inappOrderUpdate !== undefined
              ? body.inappOrderUpdate
              : existing.inappOrderUpdate,
          inappMaintenance:
            body.inappMaintenance !== undefined
              ? body.inappMaintenance
              : existing.inappMaintenance,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(notificationSettings.id, existing.id))
        .returning()
        .get();
    } else {
      updated = db
        .insert(notificationSettings)
        .values({
          userId: 1,
          whatsappTxStatus: body.whatsappTxStatus ?? true,
          whatsappPromo: body.whatsappPromo ?? false,
          emailReceipt: body.emailReceipt ?? true,
          emailNewsletter: body.emailNewsletter ?? false,
          inappOrderUpdate: body.inappOrderUpdate ?? true,
          inappMaintenance: body.inappMaintenance ?? true,
        })
        .returning()
        .get();
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Pengaturan notifikasi berhasil disimpan',
    });
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan pengaturan notifikasi' },
      { status: 500 }
    );
  }
}
