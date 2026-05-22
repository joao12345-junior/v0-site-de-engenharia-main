import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const navigation = {
	empresa: [
		{ name: "Sobre Nós", href: "/sobre" },
		{ name: "Projetos", href: "/projetos" },
		{ name: "Clientes", href: "/clientes" },
		{ name: "Contato", href: "/contato" },
	],
	servicos: [
		{ name: "Projetos Hidrossanitários", href: "/produtos" },
		{ name: "Projetos de Incêndio", href: "/produtos" },
		{ name: "Projetos Elétricos", href: "/produtos" },
		{ name: "Projetos de Gás", href: "/produtos" },
	],
};

export function Footer() {
	return (
		<footer className="bg-card border-t border-border">
			<div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
					<div className="lg:col-span-1">
						<Link href="/" className="-m-2.5 p-2.5 flex items-center gap-3">
							<div className="relative h-16 w-40 flex items-center justify-center overflow-hidden rounded-md bg-white p-2">
								<Image
									src="/images/optare_logo.png"
									alt="OPTARE Logo"
									fill
									loading="eager"
									className="object-contain p-1"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Uma nova opção em projetos complementares. Trabalhando em parceria
							com as maiores construtoras, redes de varejo, hospitais,
							indústrias e condomínios do Rio Grande do Sul.
						</p>
					</div>
					<div>
						<h3 className="text-sm font-semibold text-foreground">Empresa</h3>
						<ul className="mt-4 space-y-3">
							{navigation.empresa.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-semibold text-foreground">Serviços</h3>
						<ul className="mt-4 space-y-3">
							{navigation.servicos.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-semibold text-foreground">Contato</h3>
						<ul className="mt-4 space-y-3">
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<Mail className="h-4 w-4" />
								administrativo@optare.com.br
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4" />
								<Link
									href="https://wa.me/5551998655612?text=Entre%20em%20contato%20conosco%20para%20discutir%20como%20podemos%20transformar%20sua%20vis%C3%A3o%20em%20realidade.%20%0ANossa%20equipe%20de%20especialistas%20est%C3%A1%20pronta%20para%20ajudar%20a%20criar%20solu%C3%A7%C3%B5es%20de%20engenharia%20inovadoras%20e%20eficientes%20para%20o%20seu%20pr%C3%B3ximo%20projeto."
									target="_blank"
									rel="noopener noreferrer"
								>
									+55 51 99865-5612
								</Link>
							</li>
							<li className="flex items-start gap-2 text-sm text-muted-foreground">
								<MapPin className="h-4 w-4 mt-0.5" />
								Porto Alegre - RS
								<br />
								Rio Grande do Sul
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-12 border-t border-border pt-8">
					<p className="text-center text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Optare Engenharia. Todos os
						direitos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
