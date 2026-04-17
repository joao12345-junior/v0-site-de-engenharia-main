import jwt from 'jsonwebtoken';

export async function verifyTokenAccess(token: string): Promise<boolean> {
    try {
        if(jwt.verify(token, process.env.JWT_SECRET_ACCESS!)){
            return true
        }
        return false
    } catch(err) {
        console.error('Erro validação token: ', err)
        return false
    }
}

export async function verifyTokenRefresh(token: string): Promise<boolean>{
    try {
        if(jwt.verify(token, process.env.JWT_SECRET_REFRESH!)){
            return true
        }
        return false
    } catch(err) {
        console.error('Erro validação token: ', err)
        return false
    }
}