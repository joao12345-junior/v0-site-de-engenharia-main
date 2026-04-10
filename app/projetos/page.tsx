import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Building2 } from "lucide-react";

const projects = [
  {
    title: "Centro Empresarial Alpha",
    category: "Construção Civil",
    location: "São Paulo, SP",
    year: "2024",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stats: { area: "15.000 m²", duration: "18 meses", value: "R$ 45M" },
  },
  {
    title: "Planta Industrial Beta",
    category: "Industrial",
    location: "Campinas, SP",
    year: "2023",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stats: { area: "25.000 m²", duration: "24 meses", value: "R$ 80M" },
  },
  {
    title: "Residencial Premium",
    category: "Residencial",
    location: "Rio de Janeiro, RJ",
    year: "2023",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stats: { area: "8.000 m²", duration: "12 meses", value: "R$ 25M" },
  },
  {
    title: "Hospital Regional",
    category: "Saúde",
    location: "Belo Horizonte, MG",
    year: "2022",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stats: { area: "12.000 m²", duration: "20 meses", value: "R$ 60M" },
  },
  {
    title: "Shopping Center Gamma",
    category: "Comercial",
    location: "Curitiba, PR",
    year: "2022",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stats: { area: "35.000 m²", duration: "30 meses", value: "R$ 120M" },
  },
  {
    title: "Universidade Delta",
    category: "Educação",
    location: "Porto Alegre, RS",
    year: "2021",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stats: { area: "20.000 m²", duration: "24 meses", value: "R$ 55M" },
  },
];

const categories = ["Todos", "Construção Civil", "Industrial", "Residencial", "Saúde", "Comercial", "Educação"];

export default function ProjetosPage() {
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
                Nossos Projetos
                <span className="h-px w-8 bg-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Projetos que Transformam
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "500+", label: "Projetos Concluídos" },
                { value: "R$ 2B+", label: "Valor Total" },
                { value: "50+", label: "Cidades Atendidas" },
                { value: "100%", label: "Entrega no Prazo" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-8 border-b border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Lista de Projetos */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <Building2 className="h-16 w-16 text-primary/30" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {project.year}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{project.stats.area}</p>
                        <p className="text-xs text-muted-foreground">Área</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{project.stats.duration}</p>
                        <p className="text-xs text-muted-foreground">Duração</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{project.stats.value}</p>
                        <p className="text-xs text-muted-foreground">Valor</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-card">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Quer ver seu projeto aqui?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Entre em contato conosco para transformar sua ideia em realidade.
              </p>
              <Button size="lg" className="mt-8" asChild>
                <Link href="/contato">
                  Iniciar Projeto
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
