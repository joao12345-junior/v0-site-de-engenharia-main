import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "E-mail",
    content: "contato@engetech.com.br",
    description: "Lorem ipsum dolor sit amet",
  },
  {
    icon: Phone,
    title: "Telefone",
    content: "+55 (11) 99999-9999",
    description: "Lorem ipsum dolor sit amet",
  },
  {
    icon: MapPin,
    title: "Endereço",
    content: "Av. Paulista, 1000 - São Paulo, SP",
    description: "Lorem ipsum dolor sit amet",
  },
  {
    icon: Clock,
    title: "Horário",
    content: "Seg - Sex: 8h às 18h",
    description: "Lorem ipsum dolor sit amet",
  },
];

export default function ContatoPage() {
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
                Contato
                <span className="h-px w-8 bg-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Entre em Contato Conosco
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </section>

        {/* Informações de Contato */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="bg-card p-6 rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{info.title}</h3>
                  <p className="text-primary font-medium mt-2">{info.content}</p>
                  <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulário e Mapa */}
        <section className="py-24 bg-card">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Formulário */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Envie sua Mensagem
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Preencha o formulário abaixo.
                </p>

                <form className="mt-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Nome
                      </label>
                      <Input id="name" placeholder="Seu nome" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        E-mail
                      </label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Telefone
                      </label>
                      <Input id="phone" placeholder="(00) 00000-0000" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        Empresa
                      </label>
                      <Input id="company" placeholder="Nome da empresa" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Assunto
                    </label>
                    <Input id="subject" placeholder="Assunto da mensagem" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mensagem
                    </label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Enviar Mensagem
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Mapa Placeholder */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Nossa Localização
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Visite nosso escritório.
                </p>
                <div className="mt-8 aspect-square rounded-lg bg-muted flex items-center justify-center border border-border">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Av. Paulista, 1000</p>
                    <p className="text-muted-foreground">São Paulo - SP</p>
                    <p className="text-muted-foreground">CEP: 01310-100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Perguntas Frequentes
              </h2>
              <p className="mt-4 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "Lorem ipsum dolor sit amet consectetur?",
                  answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
                },
                {
                  question: "Sed do eiusmod tempor incididunt ut labore?",
                  answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
                },
                {
                  question: "Ut enim ad minim veniam quis nostrud?",
                  answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
                },
                {
                  question: "Duis aute irure dolor in reprehenderit?",
                  answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
