import jwt from "jsonwebtoken";

export function createTokenAccess(email: string): string {
	try {
		return jwt.sign({ email: email }, process.env.JWT_SECRET_ACCESS!, {
			expiresIn: process.env
				.JWT_EXPIRES_IN_ACCESS as jwt.SignOptions["expiresIn"],
		});
	} catch (err: any) {
		console.error("Erro criação token_access: ", err.message);
		return "";
	}
}

export function createTokenRefresh(email: string): string {
	try {
		return jwt.sign({ email: email }, process.env.JWT_SECRET_REFRESH!, {
			expiresIn: process.env
				.JWT_EXPIRES_IN_REFRESH as jwt.SignOptions["expiresIn"],
		});
	} catch (err: any) {
		console.error("Erro criação token_refresh: ", err.message);
		return "";
	}
}
