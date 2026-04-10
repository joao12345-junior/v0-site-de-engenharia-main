import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

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
                <Image src="/optare_logo.png" alt="OPTARE Logo" fill className="object-contain p-1" />
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Uma nova opção em projetos complementares. Trabalhando em parceria com as maiores construtoras, redes de varejo, hospitais, indústrias e condomínios do Rio Grande do Sul.
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
                contato@optare.eng.br
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +55 (51) 99999-9999
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                Porto Alegre - RS<br />Rio Grande do Sul
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} OPTARE Engenharia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
