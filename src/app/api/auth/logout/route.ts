import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Berhasil keluar dari akun TokoGem',
    });

    // Clear auth cookies
    response.cookies.set('tokogem_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal keluar dari sesi' },
      { status: 500 }
    );
  }
}
