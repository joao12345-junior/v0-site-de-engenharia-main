import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Quote, Star, Building, Factory, Hospital, School, ShoppingBag, Landmark } from "lucide-react";

const clients = [
  { name: "Empresa Alpha", sector: "Indústria", icon: Factory },
  { name: "Construtora Beta", sector: "Construção", icon: Building },
  { name: "Hospital Gamma", sector: "Saúde", icon: Hospital },
  { name: "Universidade Delta", sector: "Educação", icon: School },
  { name: "Shopping Epsilon", sector: "Varejo", icon: ShoppingBag },
  { name: "Banco Zeta", sector: "Financeiro", icon: Landmark },
  { name: "Indústria Eta", sector: "Indústria", icon: Factory },
  { name: "Construtora Theta", sector: "Construção", icon: Building },
  { name: "Clínica Iota", sector: "Saúde", icon: Hospital },
  { name: "Escola Kappa", sector: "Educação", icon: School },
  { name: "Loja Lambda", sector: "Varejo", icon: ShoppingBag },
  { name: "Financeira Mu", sector: "Financeiro", icon: Landmark },
];

const testimonials = [
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    author: "Carlos Mendes",
    role: "Diretor de Operações",
    company: "Empresa Alpha",
    rating: 5,
  },
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    author: "Fernanda Lima",
    role: "Gerente de Projetos",
    company: "Construtora Beta",
    rating: 5,
  },
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    author: "Roberto Silva",
    role: "Superintendente",
    company: "Hospital Gamma",
    rating: 5,
  },
];

const sectors = [
  { name: "Indústria", count: 45, icon: Factory },
  { name: "Construção", count: 38, icon: Building },
  { name: "Saúde", count: 22, icon: Hospital },
  { name: "Educação", count: 18, icon: School },
  { name: "Varejo", count: 15, icon: ShoppingBag },
  { name: "Financeiro", count: 12, icon: Landmark },
];

export default function ClientesPage() {
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
                Nossos Clientes
                <span className="h-px w-8 bg-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Parceiros de Confiança
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </section>

        {/* Setores */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Setores que Atendemos
              </h2>
              <p className="mt-4 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {sectors.map((sector) => (
                <div
                  key={sector.name}
                  className="bg-card p-6 rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                    <sector.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{sector.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">{sector.count}+</p>
                  <p className="text-xs text-muted-foreground">clientes</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid de Clientes */}
        <section className="py-24 bg-card">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Empresas que Confiam em Nós
              </h2>
              <p className="mt-4 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="bg-background p-6 rounded-lg border border-border flex flex-col items-center text-center hover:border-primary/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <client.icon className="h-8 w-8 text-primary/50" />
                  </div>
                  <h3 className="font-semibold text-foreground">{client.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{client.sector}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="mt-4 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="bg-card p-8 rounded-lg border border-border"
                >
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{testimonial.quote}</p>
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-primary">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Faça Parte da Nossa Lista de Clientes
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Junte-se a centenas de empresas satisfeitas.
            </p>
            <Button size="lg" variant="secondary" className="mt-8" asChild>
              <Link href="/contato">
                Entrar em Contato
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
