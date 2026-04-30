import jwt from "jsonwebtoken";

export async function verifyTokenAccess(token: string): Promise<boolean> {
	try {
		if (await jwt.verify(token, process.env.JWT_SECRET_ACCESS!)) {
			return true;
		}
		return false;
	} catch (err) {
		console.error("Erro validação token: ", err);
		return false;
	}
}

export async function verifyTokenRefresh(token: string): Promise<boolean> {
	try {
		if (await jwt.verify(token, process.env.JWT_SECRET_REFRESH!)) {
			return true;
		}
		return false;
	} catch (err) {
		console.error("Erro validação token: ", err);
		return false;
	}
}

export async function createTokenAccess(email: string): Promise<string> {
	try {
		return await jwt.sign({ email: email }, process.env.JWT_SECRET_ACCESS!, {
			expiresIn: process.env.JWT_EXPIRES_IN_ACCESS as any,
		});
	} catch (err: any) {
		console.error("Erro criação token_access: ", err.message);
		return "";
	}
}

export async function createTokenRefresh(email: string): Promise<string> {
	try {
		return await jwt.sign({ email: email }, process.env.JWT_SECRET_REFRESH!, {
			expiresIn: process.env.JWT_EXPIRES_IN_REFRESH as any,
		});
	} catch (err: any) {
		console.error("Erro criação token_refresh: ", err.message);
		return "";
	}
}
