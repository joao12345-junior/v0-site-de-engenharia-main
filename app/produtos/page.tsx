import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Cog, Zap, Shield, Gauge, Wrench, Building2 } from "lucide-react";

const products = [
  {
    icon: Cog,
    name: "Sistema de Automação Industrial",
    category: "Automação",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: ["Lorem ipsum dolor", "Consectetur adipiscing", "Sed do eiusmod", "Tempor incididunt"],
  },
  {
    icon: Zap,
    name: "Painéis Elétricos",
    category: "Elétrica",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: ["Lorem ipsum dolor", "Consectetur adipiscing", "Sed do eiusmod", "Tempor incididunt"],
  },
  {
    icon: Shield,
    name: "Sistemas de Segurança",
    category: "Segurança",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: ["Lorem ipsum dolor", "Consectetur adipiscing", "Sed do eiusmod", "Tempor incididunt"],
  },
  {
    icon: Gauge,
    name: "Equipamentos de Medição",
    category: "Instrumentação",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: ["Lorem ipsum dolor", "Consectetur adipiscing", "Sed do eiusmod", "Tempor incididunt"],
  },
  {
    icon: Wrench,
    name: "Ferramentas Especializadas",
    category: "Ferramentas",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: ["Lorem ipsum dolor", "Consectetur adipiscing", "Sed do eiusmod", "Tempor incididunt"],
  },
  {
    icon: Building2,
    name: "Estruturas Metálicas",
    category: "Estrutural",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: ["Lorem ipsum dolor", "Consectetur adipiscing", "Sed do eiusmod", "Tempor incididunt"],
  },
];

const categories = ["Todos", "Automação", "Elétrica", "Segurança", "Instrumentação", "Ferramentas", "Estrutural"];

export default function ProdutosPage() {
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
                Nossos Produtos
                <span className="h-px w-8 bg-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Soluções em Engenharia de Alta Qualidade
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
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

        {/* Lista de Produtos */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <product.icon className="h-16 w-16 text-primary/50" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-primary">{product.category}</span>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                    <ul className="mt-4 space-y-2">
                      {product.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-6" asChild>
                      <Link href="/contato">
                        Solicitar Orçamento
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
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
              Não encontrou o que procura?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Entre em contato conosco.
            </p>
            <Button size="lg" variant="secondary" className="mt-8" asChild>
              <Link href="/contato">
                Fale Conosco
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
