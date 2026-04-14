"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MapPin, Building2, ChevronLeft, ChevronRight, Key } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import imagesData from "@/public/images/projetos/images.json";

const categories = { Main: "Todos", Comercial: "Comercial", Industrial: "Industrial", Residencial: "Residencial", Saúde: "Saúde", Educação: "Educação" };

const projects = [
  {
    title: "RENNER Shopping Iguatemi",
    category: categories.Comercial,
    location: "",
    description: "",
  },
  {
    title: "Rodin",
    category: categories.Residencial,
    location: "",
    description: "",
  },
  {
    title: "BIG Torres",
    category: categories.Comercial,
    location: "",
    description: "",
  },
  {
    title: "Botanique Residences",
    category: categories.Residencial,
    location: "",
    description: "",
  },
  {
    title: "Petz Taguatinga",
    category: categories.Comercial,
    location: "",
    description: "",
  },
  {
    title: "MedPlex Eixo Norte",
    category: categories.Saúde,
    location: "",
    description: "",
  },
  {
    title: "Complexo Hospitalar Moinhos de Vento",
    category: categories.Saúde,
    location: "",
    description: "",
  },
  {
    title: "Barra Shopping Sul",
    category: categories.Comercial,
    location: "",
    description: "",
  },
  {
    title: "Atlântida Lagos Park",
    category: categories.Residencial,
    location: "",
    description: "",
  },
  {
    title: "Anita Residences",
    category: categories.Residencial,
    location: "",
    description: "",
  },
  {
    title: "Magno Três Figueiras",
    category: categories.Residencial,
    location: "",
    description: "",
  },
  {
    title: "Hola Sunset Lofts",
    category: categories.Residencial,
    location: "",
    description: "",
  },
  {
    title: "Studio CB",
    category: categories.Residencial,
    location: "",
    description: "",
  },
  {
    title: "Verdan",
    category: categories.Residencial,
    location: "",
    description: "",
  }
];

//Função para buscar no JSON as localizações dos projetos baseado no título
function getLocationImage(json: any, project: any) {
  for (const client of json) {
    for (const image of client.imagens) {
      console.log(`${image.subtitulo}, ${project.title}`)
      if (image.subtitulo.toLowerCase().includes(project.title.toLowerCase())) {
        project.location = image.localization || null;
        return;
      }
    }
  }
}

projects.map(project => getLocationImage(imagesData, project));

//Define as categorias únicas dos projetos para os filtros
function setCategory(projects: any) {
  const SetCategory = new Set<string>();
  SetCategory.add(categories.Main);
  for (const project of projects) {
    if (project.category) {
      SetCategory.add(project.category);
    }
  }
  return SetCategory;
}

// Função para buscar imagens baseado no título do projeto
function getProjectImages(projectTitle: string): string[] {
  for (const client of imagesData) {
    for (const image of client.imagens) {
      // Comparação fuzzy - verifica se o título está contido no subtítulo ou vice-versa
      if (
        image.subtitulo.toLowerCase().includes(projectTitle.toLowerCase()) ||
        projectTitle.toLowerCase().includes(image.subtitulo.split(" ")[0].toLowerCase())
      ) {
        return image.urls_imagens || [];
      }
    }
  }
  return [];
}

//Função para filtrar os projetos baseado nas categorias
function filterProjectsByCategory(category: string) {
  if (category === categories.Main) return projects.forEach(project => document.getElementById(project.title)?.classList.remove('hidden'));;
  projects.filter(project => project.category !== category).forEach(project => document.getElementById(project.title)?.classList.add('hidden'));
  return projects.filter(project => project.category === category).forEach(project => document.getElementById(project.title)?.classList.remove('hidden'));
}

// Componente do Carrossel de Imagens
function ProjectImageCarousel({ projectTitle }: { projectTitle: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = useMemo(() => getProjectImages(projectTitle), [projectTitle]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center">
        <Building2 className="h-16 w-16 text-primary/30" />
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="aspect-video relative overflow-hidden bg-muted">
      <Image
        src={images[currentImageIndex]}
        alt={`${projectTitle} - Imagem ${currentImageIndex + 1}`}
        fill
        className="object-cover"
        priority={currentImageIndex === 0}
      />

      {/* Navegação do Carrossel - Visível apenas se houver múltiplas imagens */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicador de página */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

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
                Desde edifícios icônicos até infraestruturas essenciais, nossos projetos refletem nosso compromisso com a excelência e a inovação. Explore nossa coleção de projetos e veja como estamos moldando o futuro da construção.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-12">
              {[
                { value: "500+", label: "Projetos Concluídos" },
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
              {Array.from(setCategory(projects)).map((category, index) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  onClick={() => filterProjectsByCategory(category)}
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
                  id={project.title}
                >
                  <div className="relative">
                    <ProjectImageCarousel projectTitle={project.title} />
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
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
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
                Entre em contato conosco para discutir como podemos transformar sua visão em realidade. Nossa equipe de especialistas está pronta para ajudar a criar soluções de engenharia inovadoras e eficientes para o seu próximo projeto.
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
