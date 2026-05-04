import jwt from "jsonwebtoken";

export function verifyTokenAccess(token: string): boolean {
	try {
		if (jwt.verify(token, process.env.JWT_SECRET_ACCESS!)) {
			return true;
		}
		return false;
	} catch (err) {
		console.error("Erro validação token: ", err);
		return false;
	}
}

export function verifyTokenRefresh(token: string): boolean {
	try {
		if (jwt.verify(token, process.env.JWT_SECRET_REFRESH!)) {
			return true;
		}
		return false;
	} catch (err) {
		console.error("Erro validação token: ", err);
		return false;
	}
}

export function createTokenAccess(email: string): string {
	try {
		return jwt.sign({ email: email }, process.env.JWT_SECRET_ACCESS!, {
			expiresIn: process.env.JWT_EXPIRES_IN_ACCESS as any,
		});
	} catch (err: any) {
		console.error("Erro criação token_access: ", err.message);
		return "";
	}
}

export function createTokenRefresh(email: string): string {
	try {
		return jwt.sign({ email: email }, process.env.JWT_SECRET_REFRESH!, {
			expiresIn: process.env.JWT_EXPIRES_IN_REFRESH as any,
		});
	} catch (err: any) {
		console.error("Erro criação token_refresh: ", err.message);
		return "";
	}
}
