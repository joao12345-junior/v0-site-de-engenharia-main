import { Droplets, Flame, Zap, Phone, Shield, Wind } from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Projetos Hidrossanitários",
    description: "Desenvolvemos projetos completos de instalações hidráulicas e sanitárias para edificações residenciais, comerciais e industriais.",
  },
  {
    icon: Flame,
    title: "Prevenção e Combate à Incêndios",
    description: "Projetos de prevenção, proteção e combate à incêndios seguindo todas as normas técnicas e legislações vigentes.",
  },
  {
    icon: Zap,
    title: "Projetos Elétricos",
    description: "Instalações elétricas de baixa e média tensão para diversos tipos de edificações e finalidades.",
  },
  {
    icon: Phone,
    title: "Telefonia",
    description: "Projetos de infraestrutura de telecomunicações, incluindo cabeamento estruturado e sistemas de comunicação.",
  },
  {
    icon: Shield,
    title: "SPDA",
    description: "Sistema de Proteção contra Descargas Atmosféricas conforme normas ABNT NBR.",
  },
  {
    icon: Wind,
    title: "Projetos de Gás",
    description: "Instalações de gás natural e GLP para residências, comércios e indústrias.",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
            <span className="h-px w-8 bg-primary" />
            Nossos Serviços
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Projetos de Instalações
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Soluções completas em projetos complementares de engenharia para a construção civil.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative bg-background p-8 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 mb-4">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
