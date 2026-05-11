"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Sobre Nós", href: "/sobre/" },
	{ name: "Produtos", href: "/produtos/" },
	{ name: "Projetos", href: "/projetos/" },
	{ name: "Clientes", href: "/clientes/" },
	{ name: "Contato", href: "/contato/" },
];

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setMobileMenuOpen(false);
	}, [pathname]);

	// [CORREÇÃO] Impede o scroll da página enquanto o menu mobile está aberto.
	// Sem isso, o usuário consegue rolar o conteúdo por baixo do menu,
	// o que é desorientador — o menu parece "flutuar" sobre uma página móvel.
	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		// Cleanup: garante que o overflow volta ao normal se o componente desmontar
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileMenuOpen]);

	return (
		// [CORREÇÃO] O menu mobile foi movido para FORA da tag <header>.
		//
		// [CONCEITO] Por que isso resolve o bug de background transparente?
		// O <header> tem `backdrop-blur-md`, que cria um "contexto de composição"
		// no browser. Elementos filhos de um contexto de composição são renderizados
		// juntos, como uma única camada. O menu mobile estava dentro desse contexto,
		// então o browser "misturava" o blur do header com o fundo do menu.
		//
		// Ao colocar o menu como irmão do <header> (não filho), ele cria seu
		// próprio contexto de composição independente — sem interferência do blur.
		//
		// Em React, o JSX de um componente pode retornar múltiplos elementos
		// usando um Fragment (<>...</>). Aqui retornamos header + menu lado a lado.
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-md border-b ${
					isScrolled ? "border-border" : "border-transparent"
				}`}
			>
				<nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
					<div className="flex lg:flex-1">
						<Link href="/" className="-m-2.5 p-2.5 flex items-center gap-3">
							<div className="relative h-16 w-40 flex items-center justify-center overflow-hidden rounded-md bg-white p-2">
								<Image
									src="/images/optare_logo.png"
									alt="OPTARE — Voltar para página inicial"
									fill
									className="object-contain p-1"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>
						</Link>
					</div>

					{/* Botões mobile */}
					<div className="flex items-center gap-2 lg:hidden">
						<ThemeToggle />
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Abrir menu</span>
							<Menu className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>

					{/* Navegação desktop */}
					<div className="hidden lg:flex lg:gap-x-8">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className="relative text-sm font-medium transition-colors group"
								>
									<span
										className={
											isActive
												? "text-foreground"
												: "text-muted-foreground group-hover:text-foreground"
										}
									>
										{item.name}
									</span>
									{isActive && (
										<motion.div
											layoutId="activeNav"
											className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
											initial={false}
											transition={{
												type: "spring",
												stiffness: 380,
												damping: 30,
											}}
										/>
									)}
								</Link>
							);
						})}
					</div>

					{/* Ações desktop */}
					<div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
						<ThemeToggle />
						<Button asChild>
							<Link href="/contato">Solicitar Orçamento</Link>
						</Button>
					</div>
				</nav>
			</header>

			{/* [CORREÇÃO] Menu mobile fora do <header>.
			    Antes estava dentro do <header> — herdava o contexto de composição
			    do backdrop-blur, causando o background transparente.
			    Agora é irmão do <header> no DOM — contexto de composição próprio.
			    
			    Funciona igual porque já é `position: fixed` — não depende do
			    fluxo normal do documento para se posicionar. */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<div className="lg:hidden">
						{/* Overlay escuro */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.25 }}
							className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
							onClick={() => setMobileMenuOpen(false)}
						/>

						{/* Painel lateral */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							// [CORREÇÃO] `bg-background` garantia fundo sólido, mas dentro
							// do header herdava o blur. Agora fora do header funciona
							// corretamente. Adicionamos `isolate` como camada extra de
							// proteção — cria contexto de empilhamento independente.
							className="fixed top-0 right-0 bottom-0 z-50 w-72 isolate bg-background shadow-2xl border-l border-border"
						>
							<div className="flex justify-end p-4">
								<button
									type="button"
									className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
									onClick={() => setMobileMenuOpen(false)}
								>
									<span className="sr-only">Fechar menu</span>
									<X className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>

							<nav className="px-6 py-4 space-y-1">
								{navigation.map((item, index) => {
									const isActive = pathname === item.href;
									return (
										<motion.div
											key={item.name}
											initial={{ opacity: 0, x: 30 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 30 }}
											transition={{
												delay: index * 0.05 + 0.1,
												type: "spring",
												stiffness: 300,
												damping: 25,
											}}
										>
											<Link
												href={item.href}
												className={`block px-3 py-3 text-base font-medium transition-colors border-l-2 ${
													isActive
														? "border-primary text-foreground bg-primary/5"
														: "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
												}`}
											>
												{item.name}
											</Link>
										</motion.div>
									);
								})}
							</nav>

							{/* Botão de contato no rodapé do menu */}
							<div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
								<Button className="w-full" asChild>
									<Link href="/contato">Solicitar Orçamento</Link>
								</Button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}
