"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputTel } from "@/components/ui/inputTel";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const contactInfo = [
	{
		icon: Mail,
		title: "E-mail",
		content: "administrativo@optare.com.br",
		description:
			"Envie-nos um e-mail e nossa equipe entrará em contato com você o mais breve possível.",
	},
	{
		icon: () => (
			<FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6 text-primary" />
		),
		title: "WhatsApp",
		content: (
			<Link
				href="https://wa.me/5551998655612?text=Entre%20em%20contato%20conosco%20para%20discutir%20como%20podemos%20transformar%20sua%20vis%C3%A3o%20em%20realidade.%20%0ANossa%20equipe%20de%20especialistas%20est%C3%A1%20pronta%20para%20ajudar%20a%20criar%20solu%C3%A7%C3%B5es%20de%20engenharia%20inovadoras%20e%20eficientes%20para%20o%20seu%20pr%C3%B3ximo%20projeto."
				target="_blank"
				rel="noopener noreferrer"
			>
				+55 51 99865-5612
			</Link>
		),
		description:
			"Converse conosco via WhatsApp para atendimento rápido e eficiente.",
	},
	{
		icon: MapPin,
		title: "Endereço",
		content: "Praça Osvaldo Cruz, nº 15 - Sala 213",
		description: "Porto Alegre/RS, Brasil - CEP: 90038-900",
	},
	{
		icon: Clock,
		title: "Horário",
		content: "Seg - Sex: 8h às 18h",
		description:
			"Nosso time está disponível para atendimento durante o horário comercial.",
	},
];

export default function ContatoPage() {
	// HTMLInputElement é o tipo correto - é o que a ref vai conter em runtime
	const telRef = useRef<HTMLInputElement>(null);
	const { register, handleSubmit, reset } = useForm();

	const onSubmit = async function (data: any) {
		const tellValue = telRef.current?.value ?? "";

		// Verifica se o campo ainda tem caracteres de máscara não preenchidos
		if (tellValue.includes("_"))
			return toast.warning(
				"Por favor, preencha o campo de telefone corretamente.",
				{ position: "top-center" },
			);
		data.phone = tellValue;
		console.log(data);

		toast.promise<{ message: string }>(
			fetch("/api/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}).then(async (res) => {
				const result = await res.json();
				if (!res.ok) throw new Error(result.message);
				return result;
			}),
			{
				position: "top-center",
				loading: "Enviando...",
				success: (data) => data.message,
				error: (err) => err.message,
			},
		);
		reset();
	};

	return (
		<>
			<Header />
			<main className="pt-20">
				{/* Hero */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-3xl text-center">
							<div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
								<span className="h-px w-8 bg-primary" />
								Contato
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Entre em Contato Conosco
							</h1>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								Você pode entrar em contato conosco por e-mail, Whatsapp ou
								visitando nosso escritório. Caso queira falar conosco, clique no
								nosso número ao final da página ou preencha o formulário abaixo
								para enviar um e-mail. Estamos ansiosos para ouvir de você e
								ajudar com suas necessidades de engenharia!
							</p>
						</div>
					</div>
				</section>

				{/* Informações de Contato */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							{contactInfo.map((info) => (
								<div
									key={info.title}
									className="bg-card p-6 rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
								>
									<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
										<info.icon className="h-6 w-6 text-primary" />
									</div>
									<h3 className="font-semibold text-foreground">
										{info.title}
									</h3>
									<p className="text-primary text-sm font-medium mt-2">
										{info.content}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										{info.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Formulário e Mapa */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="grid lg:grid-cols-2 gap-12">
							{/* Formulário */}
							<div>
								<h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
									Envie sua Mensagem
								</h2>
								<p className="mt-4 text-muted-foreground">
									Preencha o formulário abaixo e nossa equipe entrará em contato
									com você o mais breve possível.
								</p>

								<form
									onSubmit={handleSubmit(onSubmit)}
									className="mt-8 space-y-6"
								>
									<div className="grid sm:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium text-foreground mb-2"
											>
												Nome
											</label>
											<Input
												type="text"
												id="name"
												placeholder="Seu nome"
												required={true}
												{...register("name")}
											/>
										</div>
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-foreground mb-2"
											>
												E-mail
											</label>
											<Input
												id="email"
												type="email"
												placeholder="seu.email@exemplo.com"
												pattern="^\S+@\S+\.\S+$"
												required={true}
												{...register("email")}
											/>
										</div>
									</div>
									<div className="grid sm:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-foreground mb-2"
											>
												Telefone
											</label>
											<InputTel name="phone" id="phone" ref={telRef} required />
										</div>
										<div>
											<label
												htmlFor="company"
												className="block text-sm font-medium text-foreground mb-2"
											>
												Empresa
											</label>
											<Input
												type="text"
												id="company"
												placeholder="Nome da empresa"
												required={true}
												{...register("company")}
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="subject"
											className="block text-sm font-medium text-foreground mb-2"
										>
											Assunto
										</label>
										<Input
											type="text"
											id="subject"
											placeholder="Assunto da mensagem"
											required={true}
											{...register("subject")}
										/>
									</div>
									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium text-foreground mb-2"
										>
											Mensagem
										</label>
										<Textarea
											id="message"
											rows={5}
											placeholder="Digite aqui o conteúdo da sua mensagem"
											required={true}
											{...register("message")}
										/>
									</div>
									<Button type="submit" size="lg" className="w-full sm:w-auto">
										Enviar Mensagem
										<Send className="ml-2 h-4 w-4" />
									</Button>
								</form>
							</div>

							{/* Mapa Placeholder */}
							<div>
								<h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
									Nossa Localização
								</h2>
								<p className="mt-4 text-muted-foreground">
									Estamos localizados no coentro de Porto Alegre, prontos para
									receber sua visita ou atender suas necessidades de engenharia.
								</p>
								<div className="mt-8 aspect-square rounded-lg bg-muted flex items-center justify-center border border-border">
									<iframe
										className="aspect-square rounded-lg bg-muted flex items-center justify-center border border-border"
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.3666821029556!2d-51.22483642535233!3d-30.02633643043536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95197909cbd6a5d3%3A0x44ad2c623eb01216!2sOptare%20Engenharia!5e0!3m2!1spt-BR!2sbr!4v1776107636756!5m2!1spt-BR!2sbr"
									></iframe>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* FAQ */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Perguntas Frequentes
							</h2>
							<p className="mt-4 text-muted-foreground">
								Tire suas principais dúvidas sobre nossos serviços, prazos e
								processo de trabalho.
							</p>
						</div>
						<div className="max-w-3xl mx-auto space-y-4">
							{[
								{
									question: "Quanto tempo leva para desenvolver um projeto?",
									answer:
										"O prazo varia conforme a complexidade e o porte da edificação. Projetos residenciais de médio porte têm prazo médio de 15 a 30 dias corridos após o recebimento completo da documentação. Empreendimentos maiores ou com múltiplas disciplinas são orçados individualmente com cronograma detalhado.",
								},
								{
									question:
										"Quais documentos são necessários para iniciar um projeto?",
									answer:
										"Em geral, precisamos do projeto arquitetônico atualizado (planta baixa, cortes e fachadas) e do memorial descritivo da edificação. Para cada disciplina pode haver requisitos adicionais — como levantamento de cargas para projetos elétricos ou definição de equipamentos para projetos hidrossanitários — que informamos durante o orçamento.",
								},
								{
									question: "A Optare atua fora de Porto Alegre?",
									answer:
										"Sim. Embora nossa base seja em Porto Alegre, atendemos projetos em todo o Rio Grande do Sul. Os projetos são desenvolvidos de forma remota, com reuniões de alinhamento por videoconferência e visitas técnicas programadas quando necessário.",
								},
								{
									question:
										"Os projetos são compatibilizados entre as disciplinas?",
									answer:
										"Sim. A compatibilização entre disciplinas é parte do nosso processo padrão. Identificamos e resolvemos interferências entre os sistemas hidrossanitários, elétricos, de incêndio e gás antes da emissão final dos projetos, reduzindo imprevistos e retrabalhos em obra.",
								},
							].map((faq, index) => (
								<div
									key={index}
									className="bg-background rounded-lg border border-border border-l-4 border-l-primary p-6 hover:border-l-primary transition-colors"
								>
									<h3 className="font-semibold text-foreground text-base">
										{faq.question}
									</h3>
									<p className="mt-3 text-muted-foreground leading-relaxed text-sm">
										{faq.answer}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
