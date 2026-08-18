import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { seedDatabase } from '@/db/seed';
import { createNotification } from '@/services/notificationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap wajib diisi' },
        { status: 400 }
      );
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Alamat email tidak valid' },
        { status: 400 }
      );
    }
    if (!phone || phone.length < 9) {
      return NextResponse.json(
        { success: false, message: 'Nomor WhatsApp tidak valid' },
        { status: 400 }
      );
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Kata sandi minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Ensure database is initialized & seeded
    await seedDatabase();

    // 2. Check for duplicate email or phone
    const existingUsers = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email.trim().toLowerCase()), eq(users.phone, phone.trim())));

    const existing = existingUsers[0];

    if (existing) {
      if (existing.email === email.trim().toLowerCase()) {
        return NextResponse.json(
          { success: false, message: 'Alamat email sudah terdaftar. Silakan gunakan email lain atau langsung masuk.' },
          { status: 409 }
        );
      }
      if (existing.phone === phone.trim()) {
        return NextResponse.json(
          { success: false, message: 'Nomor WhatsApp sudah terdaftar. Silakan gunakan nomor lain atau langsung masuk.' },
          { status: 409 }
        );
      }
    }

    // 3. Insert new user
    const insertResult = await db
      .insert(users)
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        passwordHash: password, // In production, bcrypt.hash
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        memberLevel: 'Bronze',
        role: 'user',
      })
      .returning();

    const newUser = insertResult[0];

    // 4. Send welcome notification
    await createNotification({
      userId: newUser.id,
      type: 'promo',
      title: 'Selamat Bergabung di ZenTopUp!',
      message: `Hai ${newUser.name}, akun kamu telah aktif. Nikmati promo diskon spesial pengguna baru hingga Rp 10.000!`,
      linkHref: '/promo',
      linkText: 'Klaim Voucher Pengguna Baru',
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran akun berhasil!',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          avatar: newUser.avatarUrl,
          memberLevel: newUser.memberLevel,
          role: newUser.role,
        },
        token: `zen_jwt_${newUser.id}_${Date.now()}`,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat pendaftaran' },
      { status: 500 }
    );
  }
}
