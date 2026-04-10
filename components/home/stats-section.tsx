const stats = [
  { value: "+15", label: "Anos de Experiência" },
  { value: "500+", label: "Projetos Realizados" },
  { value: "100+", label: "Clientes Satisfeitos" },
  { value: "RS", label: "Atuação Regional" },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-primary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-primary-foreground sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
