"use client";

import { Droplets, Flame, Zap, Phone, Shield, Wind } from "lucide-react";
import { motion } from "framer-motion";
import {
	fadeUpVariants,
	staggerContainerDelayedVariants,
	defaultViewport,
} from "@/lib/animation-variants";
import HidroIcon from "@/public/images/logos/optare/hidro.svg";
import PPCIIcon from "@/public/images/logos/optare/ppci.svg";
import EletricaIcon from "@/public/images/logos/optare/eletrica.svg";
import GasIcon from "@/public/images/logos/optare/gas.svg";
import OleoIcon from "@/public/images/logos/optare/oleo_diesel.svg";
import GasesMedicinaisIcon from "@/public/images/logos/optare/gases_medicinais.svg";

const services = [
	{
		icon: HidroIcon,
		title: "Projetos Hidrossanitários",
		description:
			"Desenvolvemos projetos completos de instalações hidráulicas e sanitárias para edificações residenciais, comerciais e industriais.",
	},
	{
		icon: PPCIIcon,
		title: "Prevenção e Proteção Contra Incêndio",
		description:
			"Projetos de PPCI seguindo as normas técnicas e a legislação vigente, do dimensionamento à aprovação junto ao Corpo de Bombeiros.",
	},
	{
		icon: EletricaIcon,
		title: "Projetos Elétricos",
		description:
			"Instalações elétricas de baixa e média tensão para diversos tipos de edificações e finalidades.",
	},
	{
		icon: GasIcon,
		title: "Projetos de Gás",
		description:
			"Instalações de gás natural e GLP para residências, comércios e indústrias.",
	},
	{
		icon: OleoIcon,
		title: "Projetos de Óleo Diesel",
		description:
			"Sistemas de armazenamento, bombeamento e distribuição de óleo diesel para geradores e aplicações industriais, conforme normas de segurança vigentes.",
	},
	{
		icon: GasesMedicinaisIcon,
		title: "Gases Medicinais",
		description:
			"Projetos de redes de gases medicinais para hospitais, clínicas e laboratórios, com dimensionamento técnico e conformidade normativa.",
	},
];

export function ServicesSection() {
	return (
		<section className="py-24 bg-card">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/*
          [DECISÃO] Heading central como motion.div separado do grid.
          Se o heading e o grid fossem filhos do mesmo stagger container,
          o heading entraria no stagger com delay calculado igual aos cards
          — comportamento errado. Separar permite controle independente.
        */}
				<motion.div
					className="mx-auto max-w-2xl text-center"
					variants={fadeUpVariants}
					initial="hidden"
					whileInView="visible"
					viewport={defaultViewport}
				>
					<div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
						<span className="h-px w-8 bg-primary" />
						Nossos Serviços
						<span className="h-px w-8 bg-primary" />
					</div>
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Projetos de Instalações
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Soluções completas em projetos complementares de engenharia para a
						construção civil.
					</p>
				</motion.div>

				{/*
          [DECISÃO] staggerContainerDelayedVariants (delayChildren: 0.15)
          em vez do padrão (0.05). O heading acima já animou — o grid
          deve esperar um momento para não sobrepor visualmente.
        */}
				<motion.div
					className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
					variants={staggerContainerDelayedVariants}
					initial="hidden"
					whileInView="visible"
					viewport={defaultViewport}
				>
					{services.map((service) => (
						/*
              [DECISÃO] motion.div substitui div — filho direto do container
              de stagger. fadeUpVariants herdado do container via propagação.
              Sem initial/animate/whileInView aqui: o container controla tudo.
            */
						<motion.div
							key={service.title}
							variants={fadeUpVariants}
							className="group relative bg-background p-8 rounded-lg border border-border hover:border-primary/50 transition-colors"
						>
							<div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 mb-4">
								<service.icon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold text-foreground">
								{service.title}
							</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
								{service.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
