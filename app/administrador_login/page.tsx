"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdministradorLoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	function togglePasswordVisibility() {
		setShowPassword((prev) => !prev);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const data = Object.fromEntries(formData.entries());

		toast.promise<{ message: string }>(
			fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
				credentials: "include", // Importante: inclui cookies na requisição
			}).then(async (res) => {
				const result = await res.json();
				if (!res.ok) throw new Error(result.message);
				return result;
			}),
			{
				position: "top-center",
				loading: "Loading...",
				success: (data) => {
					router.push("/administrador/");
					return data.message;
				},
				error: (err) => {
					router.refresh;
					return err.message;
				},
			},
		);
	}

	return (
		<>
			<Header />
			<main className="flex items-center justify-center min-h-screen bg-background">
				<form
					onSubmit={handleSubmit}
					className="max-w-md mx-auto bg-card p-12 rounded-lg shadow-md"
				>
					<h2 className="text-2xl font-bold mb-6 text-center">
						Login do Administrador
					</h2>
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-foreground mb-1"
						>
							Email
						</label>
						<Input
							type="email"
							id="email"
							className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="Digite seu email"
							required
							name="email"
						/>
					</div>
					<div className="mb-6">
						<label
							htmlFor="password"
							className="flex row gap-2 block text-sm font-medium text-foreground mb-1"
						>
							Senha
							<button type="button" onClick={togglePasswordVisibility}>
								{showPassword ? <EyeOff /> : <Eye />}
							</button>
						</label>
						<Input
							type={showPassword ? "text" : "password"}
							id="password"
							className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="Digite sua senha"
							required
							name="password"
						/>
					</div>
					<Button
						type="submit"
						className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
					>
						Entrar
					</Button>
				</form>
			</main>
		</>
	);
}
