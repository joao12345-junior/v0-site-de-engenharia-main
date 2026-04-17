'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export default function AdministradorLoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    function togglePasswordVisibilitry(){
        setShowPassword(prev => !prev);
    }
    
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Aqui você pode adicionar a lógica de autenticação, como enviar os dados para um servidor ou verificar as credenciais localmente
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <>
            <Header />
            <main className="flex items-center justify-center min-h-screen bg-background">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-card p-12 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login do Administrador</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
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
                        <label htmlFor="password" className="flex row gap-2 block text-sm font-medium text-foreground mb-1">Senha 
                        <button
                                type="button"
                                onClick={togglePasswordVisibilitry}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </label>
                        <Input
                            type={showPassword ? 'text' : 'password'}
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
    )
}