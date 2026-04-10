import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets, Flame, Zap, Wind } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-primary mb-6">
              <span className="h-px w-8 bg-primary" />
              Projetos de Engenharia
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              Uma Nova Opção em Projetos Complementares
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              A OPTARE é especializada na elaboração de projetos de engenharia para o setor da construção civil. Desenvolvemos projetos hidrossanitários, de prevenção e combate à incêndios, elétricos, de telefonia, SPDA e gás.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/projetos">
                  Ver Projetos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sobre">Conheça a Empresa</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <Droplets className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-foreground">Hidrossanitários</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Projetos completos de instalações hidráulicas e sanitárias.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <Flame className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-foreground">Incêndio</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Prevenção, proteção e combate à incêndios.
                </p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-card p-6 rounded-lg border border-border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-foreground">Elétricos</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Elétrica, telefonia e SPDA.
                </p>
              </div>
              <div className="bg-primary p-6 rounded-lg">
                <p className="text-4xl font-bold text-primary-foreground">+15</p>
                <p className="text-sm text-primary-foreground/80 mt-2">Anos de experiência desde 2010</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
