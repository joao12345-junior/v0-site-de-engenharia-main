"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import OptareLogoBlack from "@/public/images/logos/optare/Logo_Black.svg";
import OptareLogoWhite from "@/public/images/logos/optare/Logo_White.svg";

const HEADING = "ESTE ENDEREÇO NÃO EXISTE NO PROJETO";

// Variações de tom geradas a partir do --primary do tema (ver globals.css),
// em vez de uma paleta paralela isolada. color-mix mantém tudo em 1 fonte de verdade.
const ACCENT_LIGHT = "color-mix(in oklch, var(--primary) 55%, white)";

export default function NotFound() {
	return (
		<div className="relative min-h-screen overflow-hidden bg-background text-foreground">
			{/* grid + radar de fundo */}
			<div
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					backgroundImage:
						"linear-gradient(color-mix(in srgb, currentColor 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, currentColor 6%, transparent) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>
			<div
				className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[220vmax] w-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] opacity-60"
				style={{
					background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, color-mix(in srgb, var(--primary) 14%, transparent) 360deg)`,
				}}
			/>

			<div className="relative z-10 flex min-h-screen flex-col">
				<nav
					className="flex items-center px-6 py-4"
					style={{ justifyContent: "space-around" }}
				>
					<div className="relative w-45">
						<OptareLogoBlack className="h-full w-full object-contain dark:hidden" />
						<OptareLogoWhite className="hidden h-full w-full object-contain dark:block" />
					</div>
					<ThemeToggle />
				</nav>

				<main className="grid flex-1 place-items-center px-4 py-12">
					<div className="flex w-full max-w-[640px] flex-col items-center gap-6 text-center">
						{/* placa "blueprint" com o 404 */}
						<div className="relative w-full overflow-hidden rounded-md border p-6 shadow-sm">
							<svg
								width="100%"
								viewBox="0 0 640 300"
								fill="none"
								aria-hidden="true"
								className="block"
							>
								<text
									x="320"
									y="20"
									textAnchor="middle"
									fontSize="11"
									letterSpacing="2"
									className="fill-muted-foreground"
								>
									ERRO HTTP · CÓDIGO DE STATUS
								</text>
								<line
									x1="40"
									y1="30"
									x2="600"
									y2="30"
									stroke={ACCENT_LIGHT}
									strokeWidth="1"
								/>
								<line
									x1="320"
									y1="34"
									x2="320"
									y2="258"
									stroke={ACCENT_LIGHT}
									strokeWidth="1"
									strokeDasharray="4 4"
								/>
								<text
									x="320"
									y="215"
									textAnchor="middle"
									fontSize="190"
									fontWeight="600"
									fill="var(--primary)"
									letterSpacing="2"
								>
									404
								</text>
								<line
									x1="40"
									y1="270"
									x2="600"
									y2="270"
									stroke={ACCENT_LIGHT}
									strokeWidth="1"
								/>
								<text
									x="320"
									y="288"
									textAnchor="middle"
									fontSize="11"
									letterSpacing="1"
									className="fill-muted-foreground"
								>
									REGISTRO · PÁGINA NÃO LOCALIZADA
								</text>
								<rect
									x="4"
									y="4"
									width="632"
									height="292"
									fill="none"
									stroke={ACCENT_LIGHT}
									strokeWidth="1"
								/>
							</svg>
						</div>

						<div className="flex flex-col gap-2">
							<h1 className="text-2xl font-semibold uppercase tracking-wide">
								{HEADING}
							</h1>
							<p className="text-muted-foreground">
								O link pode ter sido removido, renomeado ou o endereço foi
								digitado incorretamente. Verifique a URL ou volte para uma seção
								válida do site.
							</p>
						</div>

						<div className="mt-2 flex flex-wrap items-center justify-center gap-4">
							<Link
								href="/"
								type="button"
								className="group relative h-14 w-56 rounded-2xl border border-border bg-secondary text-center text-base font-semibold text-secondary-foreground"
							>
								<span className="absolute left-1 top-1 z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-primary duration-500 group-hover:w-[216px]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 1024 1024"
										height="22px"
										width="22px"
										className="shrink-0"
									>
										<path
											d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
											fill="var(--primary-foreground)"
										/>
										<path
											d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
											fill="var(--primary-foreground)"
										/>
									</svg>
								</span>
								<span className="inline-block whitespace-nowrap pl-16 leading-[3.5rem]">
									Voltar ao início
								</span>
							</Link>
							<a
								href="https://wa.me/5551998655612?text=Ol%C3%A1%2C%20cheguei%20numa%20p%C3%A1gina%20que%20n%C3%A3o%20existe%20mais%20no%20site%20da%20Optare%20e%20gostaria%20de%20ajuda."
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex h-12 items-center gap-2 rounded-md border px-6 text-sm font-medium uppercase tracking-wide transition hover:bg-[var(--primary)] hover:text-primary-foreground"
							>
								<FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
								WhatsApp
							</a>
							<a
								href="mailto:administrativo@optare.com.br"
								className="inline-flex h-12 items-center gap-2 rounded-md border px-6 text-sm font-medium uppercase tracking-wide transition hover:bg-[var(--primary)] hover:text-primary-foreground"
							>
								<Mail className="h-4 w-4" />
								E-mail
							</a>
						</div>

						<p className="mt-4 text-xs text-muted-foreground">
							Erro 404 · Optare Engenharia — Projetos hidrossanitários,
							incêndio, elétrico, telefonia, SPDA e gás
						</p>
					</div>
				</main>

				<footer className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4 text-xs text-muted-foreground">
					<span>© 2026 Optare Engenharia</span>
					<span>optare.com.br</span>
				</footer>
			</div>
		</div>
	);
}
