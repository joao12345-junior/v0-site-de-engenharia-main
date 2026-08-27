"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
	fadeUpVariants,
	staggerContainerVariants,
	fadeRightVariants,
} from "@/lib/animation-variants";
import HidroIcon from "@/public/images/logos/optare/hidro.svg";
import PPCIIcon from "@/public/images/logos/optare/ppci.svg";
import EletricaIcon from "@/public/images/logos/optare/eletrica.svg";

export function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center pt-20">
			{/* Background pattern */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-50" />
			</div>

			<div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* ── Coluna esquerda: texto ── */}
					{/*
            [DECISÃO] staggerContainerVariants aqui faz os 4 filhos diretos
            (eyebrow, h1, p, botões) aparecerem em cascata.
            initial="hidden" + animate="visible" porque está acima da dobra.
          */}
					<motion.div
						variants={staggerContainerVariants}
						initial="hidden"
						animate="visible"
					>
						{/*
              [DECISÃO] motion.div em vez de motion.div na div original.
              Cada filho precisa ser motion.* para herdar as variants do container.
              Filhos HTML normais (<div>, <h1>) não participam do stagger —
              o Framer Motion só propaga variants para componentes motion.*.
            */}
						<motion.div
							variants={fadeUpVariants}
							className="flex items-center gap-2 text-sm text-primary mb-6"
						>
							<span className="h-px w-8 bg-primary" />
							Projetos de Engenharia
						</motion.div>

						<motion.h1
							variants={fadeUpVariants}
							className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance"
						>
							A Melhor Opção em Projetos Complementares
						</motion.h1>

						<motion.p
							variants={fadeUpVariants}
							className="mt-6 text-lg leading-relaxed text-muted-foreground"
						>
							A Optare é especializada na elaboração de projetos de engenharia
							para o setor da construção civil. Desenvolvemos projetos
							hidrossanitários, de prevenção e combate à incêndios, elétricos,
							de telefonia, SPDA e gás.
						</motion.p>

						<motion.div
							variants={fadeUpVariants}
							className="mt-10 flex flex-col sm:flex-row gap-4"
						>
							<Button size="lg" asChild>
								<Link href="/projetos">
									Ver Projetos
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="/sobre">Conheça a Empresa</Link>
							</Button>
						</motion.div>
					</motion.div>

					{/* ── Coluna direita: cards ── */}
					{/*
            [DECISÃO] fadeRightVariants no container inteiro — a coluna
            inteira desliza da direita. Não usamos stagger nos cards aqui
            porque mudar os filhos para motion.* exigiria alterar o HTML
            interno dos cards, violando a regra de preservação do JSX.
            
            animate (não whileInView) — mesma razão da coluna esquerda:
            está acima da dobra no carregamento inicial.
          */}
					<motion.div
						variants={fadeRightVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-2 gap-4"
					>
						<div className="space-y-4">
							<div className="bg-card p-6 rounded-lg border border-border">
								<HidroIcon className="h-10 w-10 text-primary mb-4" />
								<h3 className="font-semibold text-foreground">
									{/* TODO: corrigir quebra artificial — ver comentário no topo */}
									<span className="block sm:inline">Hidrossani</span>
									<span className="block sm:inline">tários</span>
								</h3>
								<p className="text-sm text-muted-foreground mt-2">
									Projetos completos de instalações hidráulicas e sanitárias.
								</p>
							</div>
							<div className="bg-card p-6 rounded-lg border border-border">
								<PPCIIcon className="h-10 w-10 text-primary mb-4" />
								<h3 className="font-semibold text-foreground">Incêndio</h3>
								<p className="text-sm text-muted-foreground mt-2">
									Prevenção, proteção e combate à incêndios.
								</p>
							</div>
						</div>
						<div className="space-y-4 mt-8">
							<div className="bg-card p-6 rounded-lg border border-border">
								<EletricaIcon className="h-10 w-10 text-primary mb-4" />
								<h3 className="font-semibold text-foreground">Elétricos</h3>
								<p className="text-sm text-muted-foreground mt-2">
									Elétrica, telefonia e SPDA.
								</p>
							</div>
							<div className="bg-primary p-6 rounded-lg">
								<p className="text-4xl font-bold text-primary-foreground">
									+15
								</p>
								<p className="text-sm text-primary-foreground/80 mt-2">
									Anos de experiência desde 2010
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
