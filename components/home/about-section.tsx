import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  "Projetos hidrossanitários completos",
  "Prevenção e combate à incêndios",
  "Projetos elétricos, telefonia e SPDA",
  "Instalações de gás",
];

export function AboutSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg bg-muted overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary">2010</div>
                  <div className="text-muted-foreground mt-2">Ano de Fundação</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-lg">
              <p className="text-3xl font-bold text-primary-foreground">RS</p>
              <p className="text-sm text-primary-foreground/80">Rio Grande do Sul</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-primary mb-4">
              <span className="h-px w-8 bg-primary" />
              Sobre a OPTARE
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Uma Nova Opção em Projetos Complementares
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Fundada em 2010 pelos experientes engenheiros civis Marcelo Berny e Márcio Trolli, a OPTARE cresceu e se consolidou como um dos principais agentes do mercado de projetos complementares.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Trabalhamos em parceria com algumas das maiores construtoras, redes de varejo, hospitais, indústrias e condomínios que atuam no Rio Grande do Sul.
            </p>

            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button asChild>
                <Link href="/sobre">
                  Saiba Mais
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
