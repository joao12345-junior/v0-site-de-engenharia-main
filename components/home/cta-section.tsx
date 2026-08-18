"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
	fadeUpVariants,
	scaleInVariants,
	staggerContainerDelayedVariants,
	shortSectionViewport,
} from "@/lib/animation-variants";

export function CTASection() {
	return (
		<section className="py-24">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/*
          [DECISÃO] scaleInVariants no card inteiro — o leve crescimento
          97%→100% dá sensação de "pouso". shortSectionViewport porque
          este elemento tem altura moderada e margin: "-60px" é suficiente.
        */}
				<motion.div
					className="relative overflow-hidden rounded-2xl bg-card border border-border p-12 sm:p-16"
					variants={scaleInVariants}
					initial="hidden"
					whileInView="visible"
					viewport={shortSectionViewport}
				>
					{/*
            [DECISÃO] staggerContainerDelayedVariants (delayChildren: 0.15)
            — o card precisa "pousar" antes do conteúdo aparecer.
            0.15s de delay garante que o scale terminou antes do stagger iniciar.
            initial/whileInView/viewport repetidos aqui porque este motion.div
            tem seu próprio gatilho — não herda do pai neste caso.
          */}
					<motion.div
						className="relative z-10 max-w-2xl"
						variants={staggerContainerDelayedVariants}
						initial="hidden"
						whileInView="visible"
						viewport={shortSectionViewport}
					>
						<motion.h2
							variants={fadeUpVariants}
							className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
						>
							Pronto para Começar seu Projeto?
						</motion.h2>
						<motion.p
							variants={fadeUpVariants}
							className="mt-4 text-lg text-muted-foreground"
						>
							Aqui na Optare Engenharia, estamos prontos para transformar suas
							ideias em realidade. Entre em contato conosco hoje mesmo para
							discutir seu projeto e descobrir como podemos ajudar a torná-lo um
							sucesso.
						</motion.p>
						<motion.div
							variants={fadeUpVariants}
							className="mt-8 flex flex-col sm:flex-row gap-4"
						>
							<Button size="lg" asChild>
								<Link href="/contato">
									Solicitar Orçamento
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="/produtos">Ver Produtos</Link>
							</Button>
						</motion.div>
					</motion.div>

					{/* Elemento decorativo — não deve animar */}
					<div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
				</motion.div>
			</div>
		</section>
	);
}
