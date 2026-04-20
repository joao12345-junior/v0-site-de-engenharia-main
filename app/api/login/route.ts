import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import { verifyUserPassword } from '../../../lib/hash';
import * as jwt from 'jsonwebtoken';
import { verifyTokenAccess, verifyTokenRefresh } from '../../../lib/token'


export async function POST(req: Request) {
    const body = await req.json();
    const access_token = jwt.sign({email: body.email}, process.env.JWT_SECRET_ACCESS!, { expiresIn: process.env.JWT_EXPIRES_IN_ACCESS as any});
    const refresh_token = jwt.sign({email: body.email}, process.env.JWT_SECRET_REFRESH!, { expiresIn: process.env.JWT_EXPIRES_IN_REFRESH as any});

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
        ?? req.headers.get('x-real-ip')
        ?? 'unknown'

    try{
        const query = await pool.query('SELECT * FROM site_optare_user.user')

            for(const user of query.rows){
                const refresh_token_db = user.refresh_token

                const isRefreshValid = await verifyTokenRefresh(refresh_token_db)     
                
                // remove se ambos forem inválidos (sessão morta)
                if (!isRefreshValid) {
                    await pool.query(
                        'DELETE FROM site_optare_user.user WHERE id = $1',
                        [user.id]
                    );
                }
            }
    } catch(err: any){
        console.error('Erro delete tokens: ', err.message)
    }

    try {
        const query = `
        INSERT INTO site_optare_user.user (email, access_level, refresh_token, ip_address) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (ip_address)
            DO UPDATE SET refresh_token = EXCLUDED.refresh_token
        RETURNING id;
        `;
        const values = [body.email, '3', refresh_token, ip];
        const result = await pool.query(query, values);
        console.log('Sessão criada para IP:', ip, '| ID:', result.rows[0].id);
        
      } catch (error: any) {
        console.error('Erro:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
    
      // Verificação de credenciais (igual antes)
      try {
        const result = await pool.query(
          'SELECT * FROM site_optare_admin.admin WHERE email = $1',
          [body.email]
        );
        
        if (result.rowCount === 0) {
          throw new Error('Email incorreto ou não encontrado');
        }
    
        if (await verifyUserPassword(body.password, result.rows[0].password)) {
          return NextResponse.json({
            body: { email: result.rows[0].email, token: access_token },
            message: 'Login realizado com sucesso',
            success: true
          }, { status: 200 });
        }
        
        return NextResponse.json({
          message: 'Email ou senha incorretos',
          success: false
        }, { status: 401 });
    
      } catch (error: any) {
        return NextResponse.json({ user: null, message: error.message }, { status: 500 });
      }
}