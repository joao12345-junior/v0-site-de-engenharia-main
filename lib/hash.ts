import argon2 from 'argon2';

export async function verifyUserPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
        const isMatch = await argon2.verify(hashedPassword, plainPassword);
        if(isMatch){
            return true
        }
        return false
    }
    catch(err){
        console.error('Error verifying password:', err);
        return false;
    }
}