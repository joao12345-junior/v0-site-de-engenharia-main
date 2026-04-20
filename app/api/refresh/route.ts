// app/api/refresh/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyTokenRefresh } from '@/lib/token';
import * as jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  // Pega o IP de quem está fazendo a requisição
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';

  try {
    // Busca a sessão pelo IP
    const result = await pool.query(
      'SELECT * FROM site_optare_user.user WHERE ip_address = $1',
      [ip]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { valid: false, message: 'Nenhuma sessão encontrada para este IP' },
        { status: 404 }
      );
    }

    const session = result.rows[0];

    // Valida se o refresh_token ainda é válido
    const isValid = await verifyTokenRefresh(session.refresh_token);
    
    if (!isValid) {
      // Limpa a sessão expirada
      await pool.query('DELETE FROM site_optare_user.user WHERE ip_address = $1', [ip]);
      return NextResponse.json(
        { valid: false, message: 'Sessão expirada' },
        { status: 401 }
      );
    }

    // Gera novo access_token
    const new_access_token = jwt.sign(
      { email: session.email },
      process.env.JWT_SECRET_ACCESS!,
      { expiresIn: process.env.JWT_EXPIRES_IN_ACCESS as any }
    );

    return NextResponse.json({
      valid: true,
      token: new_access_token,
      email: session.email
    });

  } catch (error: any) {
    return NextResponse.json({ valid: false, message: error.message }, { status: 500 });
  }
}