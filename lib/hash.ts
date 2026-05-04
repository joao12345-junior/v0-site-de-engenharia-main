import argon2 from "argon2";

export async function verifyHash(
	plainPassword: string,
	hashedPassword: string,
): Promise<boolean> {
	try {
		const isMatch = await argon2.verify(hashedPassword, plainPassword);
		if (isMatch) {
			return true;
		}
		return false;
	} catch (err: unknown) {
		console.error("\n[/lib/hash]Error verifying password: ", err);
		return false;
	}
}

export async function createHashString(Str: string): Promise<string> {
	try {
		return argon2.hash(Str, {
			type: argon2.argon2id,
			hashLength: 70,
		});
	} catch (err: unknown) {
		console.error("\n[/lib/hash]Error creating string hashed: ", err);
		return "";
	}
}
