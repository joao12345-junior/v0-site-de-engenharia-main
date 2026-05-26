// components/home/client-carousel-client.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
// Adicione este import no topo do client-carousel-client.tsx
import type { LogoEntry } from "@/lib/utils/logo-resolver";

// E remova a declaração local da interface LogoEntry que está no arquivo

// ─── Tipos ────────────────────────────────────────────────────────────────

interface ClientEntry {
	CLIENTE: string;
	Site: string;
	categoria: string;
}

interface ClientCarouselClientProps {
	clients: ClientEntry[];
	logoMap: Record<string, LogoEntry>; // ← mudou aqui
}

interface ClientLogoProps {
	client: ClientEntry;
	logo: LogoEntry; // ← recebe o objeto completo, não só uma URL
}

// ─── Constantes ───────────────────────────────────────────────────────────

// w-45 (180px) + gap-8 (32px) = 212px
const ITEM_WIDTH = 212;
const SCROLL_SPEED = 0.5;

// ─── Helpers ──────────────────────────────────────────────────────────────

function getInitials(name: string): string {
	return name
		.split(" ")
		.filter((w) => w.length > 2)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join("");
}

// ─── Subcomponente: ClientLogo ────────────────────────────────────────────

function ClientLogo({ client, logo }: ClientLogoProps) {
	const { resolvedTheme } = useTheme();
	const logoUrl = resolvedTheme === "dark" ? logo.dark : logo.light;

	return (
		<div
			title={client.CLIENTE}
			className={`
                flex-shrink-0 w-45 h-25
                flex items-center justify-center
                rounded-xl p-4
                transition-colors duration-200
                ${
									resolvedTheme === "dark"
										? "bg-[oklch(0.22_0_0)]"
										: "bg-[oklch(0.97_0_0)]"
								}
            `}
		>
			{logoUrl ? (
				<img
					src={logoUrl}
					alt={client.CLIENTE}
					draggable={false}
					className={`
                        w-full h-full object-contain
                        ${resolvedTheme === "dark" ? "brightness-90" : ""}
                    `}
				/>
			) : (
				<span className="text-sm font-semibold text-muted-foreground tracking-wide text-center leading-tight">
					{getInitials(client.CLIENTE)}
				</span>
			)}
		</div>
	);
}

// ─── Componente principal ─────────────────────────────────────────────────

export function ClientCarouselClient({
	clients,
	logoMap,
}: ClientCarouselClientProps) {
	// Triplicamos para o loop infinito por teleporte silencioso
	const tripled = [...clients, ...clients, ...clients];

	// ── Estado ────────────────────────────────────────────────────────────
	const [isHovered, setIsHovered] = useState(false);
	const [isDraggingState, setIsDragging] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);

	// ── Refs ──────────────────────────────────────────────────────────────
	const viewportRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollStart = useRef(0);
	const rafRef = useRef<number | null>(null);

	// ── Posição inicial: terço do meio ────────────────────────────────────
	useEffect(() => {
		const vp = viewportRef.current;
		if (!vp) return;
		vp.scrollLeft = clients.length * ITEM_WIDTH;
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// ── Teleporte silencioso ──────────────────────────────────────────────
	const checkLoop = useCallback(() => {
		const vp = viewportRef.current;
		if (!vp) return;
		const single = clients.length * ITEM_WIDTH;
		if (vp.scrollLeft >= single * 2) vp.scrollLeft -= single;
		if (vp.scrollLeft < single * 0.5) vp.scrollLeft += single;
	}, [clients.length]);

	// ── Auto-scroll ───────────────────────────────────────────────────────
	useEffect(() => {
		const tick = () => {
			const vp = viewportRef.current;
			if (vp && !isHovered && !isDragging.current) {
				vp.scrollLeft += SCROLL_SPEED;
				checkLoop();
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
		};
	}, [isHovered, checkLoop]);

	// ── Dot ativo ─────────────────────────────────────────────────────────
	useEffect(() => {
		const vp = viewportRef.current;
		if (!vp) return;
		const handleScroll = () => {
			const offset = clients.length * ITEM_WIDTH;
			const raw = Math.round((vp.scrollLeft - offset) / ITEM_WIDTH);
			const index = ((raw % clients.length) + clients.length) % clients.length;
			setActiveIndex(index);
		};
		vp.addEventListener("scroll", handleScroll, { passive: true });
		return () => vp.removeEventListener("scroll", handleScroll);
	}, [clients.length]);

	// ── Drag — mouse + touch ──────────────────────────────────────────────────

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		isDragging.current = true;
		setIsDragging(true);
		startX.current = e.pageX;
		scrollStart.current = viewportRef.current?.scrollLeft ?? 0;
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging.current) return;
			const vp = viewportRef.current;
			if (!vp) return;
			vp.scrollLeft = scrollStart.current - (e.pageX - startX.current);
			checkLoop();
		},
		[checkLoop],
	);

	const handleMouseUp = useCallback(() => {
		isDragging.current = false;
		setIsDragging(false);
	}, []);

	// [NOVO] Touch handlers — mesma lógica, mas com e.touches[0]
	// em vez de e.pageX, pois toque pode ter múltiplos pontos simultâneos.
	// Usamos touches[0] para pegar o primeiro dedo.
	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		isDragging.current = true;
		startX.current = e.touches[0].pageX;
		scrollStart.current = viewportRef.current?.scrollLeft ?? 0;
	}, []);

	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!isDragging.current) return;
			const vp = viewportRef.current;
			if (!vp) return;
			vp.scrollLeft =
				scrollStart.current - (e.touches[0].pageX - startX.current);
			checkLoop();
		},
		[checkLoop],
	);

	const handleTouchEnd = useCallback(() => {
		isDragging.current = false;
	}, []);

	// ── Botões ────────────────────────────────────────────────────────────
	const scrollByOne = useCallback(
		(direction: "left" | "right") => {
			const vp = viewportRef.current;
			if (!vp) return;
			vp.scrollBy({
				left: direction === "right" ? ITEM_WIDTH : -ITEM_WIDTH,
				behavior: "smooth",
			});
			setTimeout(checkLoop, 350);
		},
		[checkLoop],
	);

	const scrollToIndex = useCallback(
		(index: number) => {
			const vp = viewportRef.current;
			if (!vp) return;
			vp.scrollTo({
				left: clients.length * ITEM_WIDTH + index * ITEM_WIDTH,
				behavior: "smooth",
			});
		},
		[clients.length],
	);

	// ── Renderização ──────────────────────────────────────────────────────
	return (
		<section className="py-16 border-t border-border">
			{/* Cabeçalho */}
			<div className="mx-auto max-w-7xl px-6 lg:px-8 mb-10">
				<div className="flex items-center justify-center gap-2 text-sm text-primary mb-2">
					<span className="h-px w-8 bg-primary" />
					Nossos Clientes
					<span className="h-px w-8 bg-primary" />
				</div>
				<p className="text-center text-muted-foreground text-sm">
					Empresas que confiam na Optare para seus projetos de engenharia.
				</p>
			</div>

			{/* Wrapper com hover e drag */}
			<div
				className="relative"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => {
					setIsHovered(false);
					handleMouseUp();
				}}
			>
				{/* Fades nas bordas */}
				<div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
				<div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

				{/* Botão esquerdo */}
				<button
					onClick={() => scrollByOne("left")}
					aria-label="Anterior"
					className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm transition-all duration-200 hover:border-primary/50 hover:text-primary ${
						isHovered
							? "opacity-100 pointer-events-auto"
							: "opacity-0 pointer-events-none"
					}`}
				>
					<ChevronLeft className="h-4 w-4" />
				</button>

				{/* Botão direito */}
				<button
					onClick={() => scrollByOne("right")}
					aria-label="Próximo"
					className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm transition-all duration-200 hover:border-primary/50 hover:text-primary ${
						isHovered
							? "opacity-100 pointer-events-auto"
							: "opacity-0 pointer-events-none"
					}`}
				>
					<ChevronRight className="h-4 w-4" />
				</button>

				{/* Viewport */}
				<div
					ref={viewportRef}
					className="overflow-x-hidden select-none"
					style={{ cursor: isDraggingState ? "grabbing" : "grab" }}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onTouchStart={handleTouchStart} // ← novo
					onTouchMove={handleTouchMove} // ← novo
					onTouchEnd={handleTouchEnd} // ← novo
				>
					<div className="flex gap-8 px-12" style={{ width: "max-content" }}>
						{tripled.map((client, index) => (
							<ClientLogo
								key={`${client.CLIENTE}-${index}`}
								client={client}
								logo={logoMap[client.CLIENTE]} // ← mudou aqui
							/>
						))}
					</div>
				</div>
			</div>

			{/* Dots */}
			<div
				className="flex justify-center gap-2 mt-6 transition-opacity duration-300"
				style={{ opacity: isHovered ? 1 : 0 }}
				aria-hidden={!isHovered}
			>
				{clients.map((client, index) => (
					<button
						key={client.CLIENTE}
						onClick={() => scrollToIndex(index)}
						className={`h-1.5 rounded-full transition-all duration-200 ${
							activeIndex === index
								? "bg-primary w-4"
								: "bg-muted-foreground/40 hover:bg-muted-foreground/70 w-1.5"
						}`}
						aria-label={`Ir para ${client.CLIENTE}`}
					/>
				))}
			</div>
		</section>
	);
}
