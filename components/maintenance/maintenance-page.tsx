// [CONCEITO] Server Component — sem "use client".
// Este componente não tem estado, efeitos nem eventos.
// O Next.js renderiza o HTML no servidor e envia pronto ao browser.
// O único "use client" da página está isolado no <Particles />.
//
// Isso é eficiente: o HTML chega completo ao browser antes do JavaScript
// carregar — melhor para SEO e para a percepção de velocidade do usuário.

import Image from "next/image";
import { Particles } from "./particles";

export function MaintenancePage() {
	return (
		// [CONCEITO] Tailwind + variáveis CSS do globals.css trabalhando juntos.
		// As classes Tailwind (bg-background, text-foreground) leem as variáveis
		// CSS definidas no :root e .dark do globals.css — por isso o tema dark/light
		// funciona automaticamente sem nenhum código extra.
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background font-mono text-foreground">
			{/* Camadas de fundo — fixas, atrás de tudo */}
			{/* [CONCEITO] z-index cria camadas visuais. Aqui: fundo(0) → partículas(0) → conteúdo(10) → rodapé(10) */}

			{/* Grid */}
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					backgroundImage: `
            linear-gradient(oklch(0.3705 0 0 / 0.15) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.3705 0 0 / 0.15) 1px, transparent 1px)
          `,
					backgroundSize: "48px 48px",
					zIndex: 0,
				}}
			/>

			{/* Vinheta */}
			<div
				className="pointer-events-none fixed inset-0"
				style={{
					background:
						"radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, oklch(0.06 0 0 / 0.85) 100%)",
					zIndex: 1,
				}}
			/>

			{/* Glow central */}
			<div
				className="pointer-events-none fixed left-1/2 top-1/2"
				style={{
					width: 600,
					height: 600,
					background:
						"radial-gradient(circle, oklch(0.4463 0.1678 27.4784 / 0.12) 0%, transparent 70%)",
					transform: "translate(-50%, -50%)",
					animation: "pulse-glow 6s ease-in-out infinite",
					zIndex: 0,
				}}
			/>

			{/* Linhas decorativas */}
			<div
				className="pointer-events-none fixed left-0 right-0 h-px"
				style={{
					top: "15%",
					background:
						"linear-gradient(90deg, transparent, var(--primary), transparent)",
					opacity: 0.25,
					animation: "scan 8s ease-in-out infinite",
					zIndex: 0,
				}}
			/>
			<div
				className="pointer-events-none fixed left-0 right-0 h-px"
				style={{
					bottom: "15%",
					background:
						"linear-gradient(90deg, transparent, var(--primary), transparent)",
					opacity: 0.25,
					animation: "scan 8s ease-in-out infinite 4s",
					zIndex: 0,
				}}
			/>

			{/* Partículas — "use client" isolado aqui */}
			<Particles />

			{/* Conteúdo central */}
			<main
				className="relative flex flex-col items-center justify-center gap-10 p-8 text-center"
				style={{
					zIndex: 10,
					animation: "maintenance-fade-in 1.2s ease forwards",
				}}
			>
				{/* Logo */}
				<div
					className="relative inline-flex items-center justify-center"
					style={{
						animation: "logo-in 1s cubic-bezier(0.22,1,0.36,1) 0.2s both",
					}}
				>
					{/* Borda com flicker — pseudo-elemento CSS não funciona em JSX inline,
              então usamos um div absoluto como substituto */}
					{/* [CONCEITO] Pseudo-elementos (::before, ::after) não existem em JSX.
              A solução padrão é criar um elemento real com position absolute
              que visualmente cumpre o mesmo papel. */}
					<div
						className="pointer-events-none absolute"
						style={{
							inset: -12,
							border: "1px solid oklch(0.3705 0 0 / 0.6)",
							animation: "border-flicker 4s ease-in-out infinite",
						}}
					/>
					<Image
						src="/images/optare_logo.png"
						alt="OPTARE Engenharia"
						width={120}
						height={100}
						priority
						style={{
							filter:
								"drop-shadow(0 0 18px oklch(0.4463 0.1678 27.4784 / 0.5))",
						}}
					/>
				</div>

				{/* Divider */}
				<div
					className="h-px w-72"
					style={{
						background:
							"linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent)",
						animation: "divider-in 1s ease 0.6s both",
					}}
				/>

				{/* Badge de status */}
				<div
					className="inline-flex items-center gap-2 border border-border bg-card px-4 py-1.5 text-xs uppercase tracking-widest text-primary"
					style={{
						boxShadow: "var(--shadow)",
						animation: "badge-in 0.8s ease 0.8s both",
					}}
				>
					{/* Dot piscando */}
					<span
						className="inline-block h-1.5 w-1.5 bg-primary"
						style={{ animation: "blink 1.4s step-end infinite" }}
					/>
					Em manutenção
				</div>

				{/* Mensagem principal */}
				<div
					className="flex flex-col items-center gap-4"
					style={{ animation: "msg-in 1s ease 1s both" }}
				>
					<h1
						className="font-display leading-none tracking-wide text-foreground"
						style={{
							fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
							fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
							textShadow: "0 0 40px oklch(0.5164 0.2011 28.1378 / 0.3)",
						}}
					>
						Logo teremos
						<br />
						<span className="text-primary">novidades</span>
					</h1>
					<p
						className="max-w-sm text-xs leading-relaxed tracking-wider"
						style={{ color: "oklch(0.5982 0 0)" }}
					>
						Estamos construindo algo novo para você.
						<br />
						Em breve nosso site estará no ar.
					</p>
				</div>

				{/* Barra de progresso decorativa */}
				<div
					className="relative h-[3px] w-72 overflow-hidden bg-muted"
					style={{ boxShadow: "var(--shadow)" }}
				>
					<div
						className="absolute top-0 h-full w-[60%]"
						style={{
							background:
								"linear-gradient(90deg, transparent, var(--primary), var(--accent))",
							animation: "progress-sweep 2.4s ease-in-out infinite",
						}}
					/>
				</div>

				{/* Tags de serviços */}
				<div
					className="flex max-w-lg flex-wrap justify-center gap-2"
					style={{ animation: "svc-in 1s ease 1.3s both" }}
				>
					{[
						"Projetos Hidrossanitários",
						"Prevenção a Incêndios",
						"Projetos Elétricos",
						"Telefonia",
						"SPDA",
						"Projetos de Gás",
					].map((service) => (
						// [CONCEITO] .map() em JSX — renderiza uma lista de elementos.
						// O atributo key é obrigatório: o React usa para identificar qual
						// item da lista mudou, foi adicionado ou removido durante re-renders.
						// Sem key, o React não consegue otimizar a atualização da lista.
						<span
							key={service}
							className="border border-border/40 px-2.5 py-1 text-[0.6rem] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
						>
							{service}
						</span>
					))}
				</div>
			</main>

			{/* Rodapé fixo */}
			<footer
				className="fixed bottom-6 left-0 right-0 flex justify-center text-[0.6rem] uppercase tracking-widest"
				style={{
					color: "oklch(0.3705 0 0)",
					zIndex: 10,
					animation: "footer-in 1s ease 1.6s both",
				}}
			>
				© 2025 OPTARE Engenharia — Todos os direitos reservados
			</footer>
		</div>
	);
}
