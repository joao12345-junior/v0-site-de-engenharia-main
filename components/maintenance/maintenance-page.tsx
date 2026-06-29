"use client";
// components/maintenance/maintenance-page.tsx

import Image from "next/image";
import { Particles } from "./particles";
import { ThemeToggle } from "../theme-toggle";

const SERVICOS = [
	"Hidrossanitários",
	"Incêndio",
	"Elétrico",
	"Telefonia",
	"SPDA",
	"Gás",
];

export function MaintenancePage() {
	return (
		<div
			style={{
				position: "relative",
				height: "100dvh",
				background: "var(--background)",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
				fontFamily: "var(--font-mono)",
				color: "var(--foreground)",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: 16,
					right: 16,
					zIndex: 9999,
					touchAction: "manipulation",
					cursor: "pointer",
				}}
			>
				<ThemeToggle />
			</div>

			{/* ── Camadas de fundo ── */}
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					backgroundImage: `
						linear-gradient(oklch(0.3705 0 0 / 0.15) 1px, transparent 1px),
						linear-gradient(90deg, oklch(0.3705 0 0 / 0.15) 1px, transparent 1px)
					`,
					backgroundSize: "40px 40px",
					zIndex: 0,
				}}
			/>
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					background:
						"radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, var(--background) 100%)",
					zIndex: 1,
				}}
			/>
			<div
				className="pointer-events-none fixed"
				style={{
					width: 500,
					height: 500,
					background:
						"radial-gradient(circle, oklch(0.4463 0.1678 27.4784 / 0.1) 0%, transparent 70%)",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					animation: "pulse-glow 6s ease-in-out infinite",
					zIndex: 0,
				}}
			/>
			<div
				className="pointer-events-none fixed left-0 right-0 h-px"
				style={{
					top: "12%",
					background:
						"linear-gradient(90deg, transparent, var(--primary), transparent)",
					opacity: 0.25,
					animation: "scan 10s ease-in-out infinite",
					zIndex: 0,
				}}
			/>
			<div
				className="pointer-events-none fixed left-0 right-0 h-px"
				style={{
					bottom: "12%",
					background:
						"linear-gradient(90deg, transparent, var(--primary), transparent)",
					opacity: 0.25,
					animation: "scan 10s ease-in-out infinite 5s",
					zIndex: 0,
				}}
			/>
			<Particles />

			{/* ── Conteúdo ── */}
			<main
				style={{
					position: "relative",
					zIndex: 10,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					textAlign: "center",
					padding: "56px 2rem 1.5rem",
					width: "100%",
					maxWidth: 640,
					overflowY: "auto",
					maxHeight: "100dvh",
				}}
			>
				{/* 1. Badge */}
				<div
					className="inline-flex items-center gap-2 border text-primary"
					style={{
						borderColor: "color-mix(in oklch, var(--primary) 40%, transparent)",
						background: "color-mix(in oklch, var(--primary) 8%, transparent)",
						padding: "6px 14px",
						fontSize: "clamp(9px, 2vw, 11px)",
						letterSpacing: ".14em",
						textTransform: "uppercase",
						marginBottom: "clamp(16px, 3vh, 28px)",
						animation: "fade-up .8s ease both",
						maxWidth: "100%",
					}}
				>
					<span
						className="inline-block h-1.5 w-1.5 shrink-0 bg-primary"
						style={{ animation: "blink 1.4s step-end infinite" }}
					/>
					<span>Site temporariamente indisponível</span>
				</div>

				{/* 2. Logo */}
				<div
					style={{
						marginBottom: "clamp(16px, 3vh, 28px)",
						animation: "fade-up .8s .1s ease both",
					}}
				>
					<div style={{ position: "relative", display: "inline-flex" }}>
						<div
							style={{
								position: "absolute",
								top: -8,
								left: -8,
								width: 12,
								height: 12,
								borderTop:
									"1px solid color-mix(in oklch, var(--primary) 60%, transparent)",
								borderLeft:
									"1px solid color-mix(in oklch, var(--primary) 60%, transparent)",
							}}
						/>
						<div
							style={{
								position: "absolute",
								bottom: -8,
								right: -8,
								width: 12,
								height: 12,
								borderBottom:
									"1px solid color-mix(in oklch, var(--primary) 60%, transparent)",
								borderRight:
									"1px solid color-mix(in oklch, var(--primary) 60%, transparent)",
							}}
						/>
						<div
							className="border"
							style={{
								background:
									"color-mix(in oklch, var(--foreground) 4%, transparent)",
								borderColor:
									"color-mix(in oklch, var(--foreground) 12%, transparent)",
								padding: "14px 20px",
								display: "inline-flex",
								animation: "border-flicker 4s ease-in-out infinite",
							}}
						>
							<Image
								src="/images/optare_logo.png"
								alt="OPTARE Engenharia"
								width={100}
								height={80}
								priority
								style={{
									filter:
										"drop-shadow(0 0 16px color-mix(in oklch, var(--primary) 40%, transparent))",
									width: "clamp(70px, 15vw, 110px)",
									height: "auto",
								}}
							/>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div
					style={{
						width: 160,
						height: 1,
						marginBottom: "clamp(16px, 3vh, 24px)",
						background:
							"linear-gradient(90deg, transparent, var(--primary), transparent)",
						animation: "fade-up .8s .2s ease both",
					}}
				/>

				{/* 3. Headline */}
				<h1
					style={{
						fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
						fontSize: "clamp(2rem, 6vw, 4rem)",
						letterSpacing: ".08em",
						lineHeight: 1.05,
						color: "var(--foreground)",
						marginBottom: "clamp(10px, 2vh, 16px)",
						animation: "fade-up .8s .3s ease both",
					}}
				>
					Em <span style={{ color: "var(--primary)" }}>manutenção</span>
					<br />
					programada
				</h1>

				{/* 4. Subtítulo */}
				<p
					style={{
						fontSize: "clamp(11px, 2vw, 13px)",
						color: "var(--muted-foreground)",
						letterSpacing: ".06em",
						lineHeight: 1.8,
						marginBottom: "clamp(16px, 3vh, 28px)",
						animation: "fade-up .8s .4s ease both",
					}}
				>
					Estamos realizando melhorias no sistema.
					<br />
					Retornaremos em breve com novidades.
				</p>

				{/* 5. Contato */}
				<div
					style={{
						display: "flex",
						gap: 12,
						marginBottom: "clamp(16px, 3vh, 28px)",
						animation: "fade-up .8s .5s ease both",
					}}
				>
					{[
						{
							href: "https://wa.me/5551998655612",
							label: "WhatsApp",
							icon: (
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
								</svg>
							),
						},
						{
							href: "mailto:administrativo@optare.com.br",
							label: "E-mail",
							icon: (
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
									<rect x="2" y="4" width="20" height="16" rx="2" />
								</svg>
							),
						},
					].map((link) => (
						<a
							key={link.label}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 border transition-colors hover:text-foreground hover:border-primary"
							style={{
								fontSize: "clamp(10px, 1.8vw, 12px)",
								letterSpacing: ".1em",
								textTransform: "uppercase",
								color: "var(--muted-foreground)",
								padding: "8px 16px",
								textDecoration: "none",
							}}
						>
							{link.icon}
							{link.label}
						</a>
					))}
				</div>

				{/* 6. Barra de progresso */}
				<div
					style={{
						width: 220,
						height: 2,
						background: "var(--border)",
						overflow: "hidden",
						marginBottom: "clamp(16px, 3vh, 28px)",
						position: "relative",
						animation: "fade-up .8s .6s ease both",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							height: "100%",
							width: "40%",
							background: "linear-gradient(90deg, transparent, var(--primary))",
							animation: "progress-sweep 2s ease-in-out infinite",
						}}
					/>
				</div>

				{/* 7. Tags de serviços */}
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center",
						gap: 8,
						maxWidth: 480,
						animation: "fade-up .8s .7s ease both",
					}}
				>
					{SERVICOS.map((s) => (
						<span
							key={s}
							className="border border-border/40 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
							style={{
								fontSize: "clamp(9px, 1.5vw, 11px)",
								letterSpacing: ".12em",
								textTransform: "uppercase",
								padding: "5px 12px",
							}}
						>
							{s}
						</span>
					))}
				</div>

				{/* Footer */}
				<footer
					className="flex justify-center"
					style={{
						color: "color-mix(in oklch, var(--primary) 80%, transparent)",
						fontSize: "clamp(8px, 1.5vw, 10px)",
						letterSpacing: ".08em",
						textTransform: "uppercase",
						marginTop: "clamp(20px, 4vh, 36px)",
						paddingBottom: 8,
						animation: "fade-up .6s .7s ease both",
					}}
				>
					© {new Date().getFullYear()} Optare Engenharia
				</footer>
			</main>
		</div>
	);
}
