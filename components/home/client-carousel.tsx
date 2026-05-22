// components/home/client-carousel.tsx
"use client";

// ─── Imports ──────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import clientsData from "@/public/JSON/clientes/clients.json";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface ClientEntry {
	CLIENTE: string;
	Site: string;
	categoria: string;
}

// ─── Constante de layout ──────────────────────────────────────────────────
// w-36 (144px) + gap-8 (32px) = 176px por item
// Centralizado aqui para ser usado em múltiplos lugares sem "número mágico".
// [CONCEITO] "Magic number" é qualquer literal numérico sem explicação.
// Nomeá-los como constantes documenta a intenção e facilita mudanças futuras.
const ITEM_WIDTH = 176;

// ─── Helpers de logo ──────────────────────────────────────────────────────

function getDomainFromUrl(url: string): string {
	try {
		return new URL(url).hostname.replace("www.", "");
	} catch {
		return "";
	}
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.filter((w) => w.length > 2)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join("");
}

// ─── Componente: ClientLogo ───────────────────────────────────────────────

interface ClientLogoProps {
	client: ClientEntry;
}

function ClientLogo({ client }: ClientLogoProps) {
	const domain = getDomainFromUrl(client.Site);
	const initials = getInitials(client.CLIENTE);
	const [logoState, setLogoState] = useState<
		"clearbit" | "favicon" | "initials"
	>(domain ? "clearbit" : "initials");
	const onClearbitError = useCallback(() => setLogoState("favicon"), []);
	const onFaviconError = useCallback(() => setLogoState("initials"), []);

	if (logoState === "initials" || !domain) {
		return (
			<div
				className="w-full h-full flex items-center justify-center bg-muted rounded"
				title={client.CLIENTE}
			>
				<span className="text-sm font-bold text-muted-foreground tracking-wide">
					{initials}
				</span>
			</div>
		);
	}
	if (logoState === "favicon") {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
				alt={client.CLIENTE}
				className="w-8 h-8 object-contain"
				onError={onFaviconError}
			/>
		);
	}
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={`https://logo.clearbit.com/${domain}`}
			alt={client.CLIENTE}
			className="w-full h-full object-contain"
			onError={onClearbitError}
		/>
	);
}

// ─── Componente principal: ClientCarousel ────────────────────────────────

export function ClientCarousel() {
	const clients = clientsData as ClientEntry[];
	// Triplicamos: [cópia A | original | cópia B]
	//
	// [CONCEITO] Loop infinito via "teleporte silencioso":
	//
	// A técnica de duplicar e usar CSS transform tinha um problema:
	// o transform movia o elemento inteiro para fora do overflow:hidden.
	//
	// A solução correta usa scroll real + reposicionamento invisível:
	//
	//   [ cópia A ][ original ][ cópia B ]
	//      ↑               ↑          ↑
	//   posição 0    posição início  posição fim
	//               (onde iniciamos)
	//
	// O usuário começa vendo o "original" (posição central).
	// Se rolar para a direita além da cópia B → teleportamos para o original.
	// Se rolar para a esquerda além da cópia A → teleportamos para o original.
	// O conteúdo é idêntico, então o usuário não percebe o salto.
	//
	// Por que triplicar em vez de duplicar?
	// Com duplicação, ao rolar muito rápido você pode chegar no fim antes
	// do reposicionamento acontecer. A cópia extra dá margem de segurança.
	const tripled = [...clients, ...clients, ...clients];

	// ── Estado de UI ──────────────────────────────────────────────────────
	const [isHovered, setIsHovered] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);

	// ── Refs ──────────────────────────────────────────────────────────────
	const viewportRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollStart = useRef(0);
	// autoScrollRef: guarda o ID do requestAnimationFrame para poder cancelar
	const autoScrollRef = useRef<number | null>(null);

	// ── Posição inicial: meio da lista triplicada ─────────────────────────
	//
	// [CONCEITO] useEffect com array de dependências vazio []:
	// Roda UMA vez, logo após o componente aparecer no DOM.
	// É o equivalente ao componentDidMount das classes antigas.
	// Usamos para posicionar o scroll no "original" (terço do meio)
	// antes que o usuário veja qualquer movimento.
	useEffect(() => {
		const vp = viewportRef.current;
		if (!vp) return;
		// Posiciona no início do "original" (segundo terço da lista triplicada)
		vp.scrollLeft = clients.length * ITEM_WIDTH;
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// ── Loop infinito: teleporte silencioso ───────────────────────────────
	//
	// [CONCEITO] Por que `behavior: "instant"` e não `"smooth"` no teleporte?
	//
	// "smooth" anima o scroll — o usuário veria a tela "pulando" para outra posição.
	// "instant" muda o scrollLeft sem animação — invisível para o usuário.
	//
	// O teleporte funciona porque:
	//   - Estamos indo para uma posição que mostra o MESMO conteúdo visualmente
	//   - A mudança é instantânea — ocorre entre frames, imperceptível
	//   - É como um ilusionista que troca cartas mais rápido que o olho vê
	const checkLoop = useCallback(() => {
		const vp = viewportRef.current;
		if (!vp) return;

		const singleSetWidth = clients.length * ITEM_WIDTH;

		// Passou do fim do "original" → vai para a cópia B → teleporta de volta
		if (vp.scrollLeft >= singleSetWidth * 2) {
			vp.scrollLeft -= singleSetWidth; // recua exatamente um "conjunto"
		}
		// Passou do início do "original" → foi para a cópia A → teleporta à frente
		if (vp.scrollLeft < singleSetWidth) {
			// Só teleporta se estiver muito próximo da borda esquerda
			if (vp.scrollLeft < singleSetWidth * 0.5) {
				vp.scrollLeft += singleSetWidth;
			}
		}
	}, [clients.length]);

	// ── Auto-scroll com requestAnimationFrame ─────────────────────────────
	//
	// [CONCEITO] requestAnimationFrame vs CSS animation vs setInterval:
	//
	//   setInterval(fn, 16)         → impreciso, pode acumular atraso, bloqueia
	//   CSS animation               → preciso, mas conflita com scrollLeft (vimos o problema)
	//   requestAnimationFrame(fn)   → preciso, sincronizado com o refresh do monitor,
	//                                 pausa automaticamente quando a aba está em background
	//
	// rAF chama nossa função exatamente antes de cada repintura do browser.
	// Em monitores de 60Hz: ~60 vezes/segundo. Em 120Hz: ~120 vezes/segundo.
	// O scroll fica sempre suave, independente do hardware.
	//
	// VELOCIDADE: 0.5px por frame = ~30px/s em 60Hz.
	// Ajuste este valor para velocidade maior (ex: 1.0) ou menor (ex: 0.3).
	const SCROLL_SPEED = 0.5;

	useEffect(() => {
		const tick = () => {
			const vp = viewportRef.current;
			if (vp && !isHovered && !isDragging.current) {
				vp.scrollLeft += SCROLL_SPEED;
				checkLoop();
			}
			autoScrollRef.current = requestAnimationFrame(tick);
		};

		autoScrollRef.current = requestAnimationFrame(tick);

		// Cleanup: cancela o loop quando o componente é desmontado.
		// Sem isso, o loop continuaria rodando em memória mesmo após
		// o componente sumir — memory leak + erros de "can't setState on unmounted component".
		return () => {
			if (autoScrollRef.current !== null) {
				cancelAnimationFrame(autoScrollRef.current);
			}
		};
	}, [isHovered, checkLoop]);

	// ── Scroll → atualizar dot ativo ──────────────────────────────────────
	useEffect(() => {
		const vp = viewportRef.current;
		if (!vp) return;

		const handleScroll = () => {
			// Subtrai o offset do terço inicial para calcular o índice correto
			const offset = clients.length * ITEM_WIDTH;
			const relativeScroll = vp.scrollLeft - offset;
			const rawIndex = Math.round(relativeScroll / ITEM_WIDTH);
			// Mantém o índice dentro dos bounds com módulo positivo
			// (o % padrão do JS pode retornar negativo para números negativos)
			const index =
				((rawIndex % clients.length) + clients.length) % clients.length;
			setActiveIndex(index);
		};

		vp.addEventListener("scroll", handleScroll, { passive: true });
		return () => vp.removeEventListener("scroll", handleScroll);
	}, [clients.length]);

	// ── Drag ──────────────────────────────────────────────────────────────
	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		isDragging.current = true;
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
			// Verifica loop após a animação terminar (~300ms)
			setTimeout(checkLoop, 350);
		},
		[checkLoop],
	);

	const scrollToIndex = useCallback(
		(index: number) => {
			const vp = viewportRef.current;
			if (!vp) return;
			const offset = clients.length * ITEM_WIDTH; // base do terço do meio
			vp.scrollTo({ left: offset + index * ITEM_WIDTH, behavior: "smooth" });
		},
		[clients.length],
	);

	// ─── Renderização ─────────────────────────────────────────────────────

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

			{/* Wrapper: hover, drag, fades e botões */}
			<div
				className="relative"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => {
					setIsHovered(false);
					handleMouseUp();
				}}
			>
				{/* Fades nas bordas — mascaram o início e fim do loop */}
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

				{/* Viewport: a "janela" — overflow hidden, recebe o drag */}
				<div
					ref={viewportRef}
					className="overflow-x-hidden select-none"
					style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
				>
					{/* Inner: todos os cards em fila — não se move por CSS, só pelo scrollLeft do viewport */}
					<div className="flex gap-8 px-12" style={{ width: "max-content" }}>
						{tripled.map((client, index) => (
							<div
								key={`${client.CLIENTE}-${index}`}
								className="flex-shrink-0 w-36 h-16 flex items-center justify-center p-3 rounded-lg border border-border bg-card pointer-events-none"
							>
								<ClientLogo client={client} />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Dots — só os clientes originais (não a lista triplicada) */}
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
