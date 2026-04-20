'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputTel } from "@/components/ui/inputTel";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Link from "next/link";

const contactInfo = [
  {
    icon: Mail,
    title: "E-mail",
    content: "administrativo@optare.com.br",
    description: "Envie-nos um e-mail e nossa equipe entrará em contato com você o mais breve possível.",
  },
  {
    icon: () => <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6 text-primary" />,
    title: "WhatsApp",
    content: <Link href="https://wa.me/5551998655612?text=Entre%20em%20contato%20conosco%20para%20discutir%20como%20podemos%20transformar%20sua%20vis%C3%A3o%20em%20realidade.%20%0ANossa%20equipe%20de%20especialistas%20est%C3%A1%20pronta%20para%20ajudar%20a%20criar%20solu%C3%A7%C3%B5es%20de%20engenharia%20inovadoras%20e%20eficientes%20para%20o%20seu%20pr%C3%B3ximo%20projeto." target="_blank" rel="noopener noreferrer">
      +55 51 99865-5612
    </Link>,
    description: "Converse conosco via WhatsApp para atendimento rápido e eficiente.",
  },
  {
    icon: MapPin,
    title: "Endereço",
    content: "Praça Osvaldo Cruz, nº 15 - Sala 213",
    description: "Porto Alegre/RS, Brasil - CEP: 90038-900",
  },
  {
    icon: Clock,
    title: "Horário",
    content: "Seg - Sex: 8h às 18h",
    description: "Nosso time está disponível para atendimento durante o horário comercial.",
  },
];

async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
  e.preventDefault();

  const TelInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
  if (TelInput.value.includes('_')) {
    return alert("Por favor, preencha o campo de telefone corretamente.");
  }

  const formData = new FormData(e.currentTarget);
  formData.append('phone', TelInput.value);
  const data = Object.fromEntries(formData.entries());
  console.log(data);
};

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
                Você pode entrar em contato conosco por e-mail, Whatsapp ou visitando nosso escritório. Caso queira falar conosco, clique no nosso número ao final da página ou preencha o formulário abaixo para enviar um e-mail. Estamos ansiosos para ouvir de você e ajudar com suas necessidades de engenharia!
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
                  <p className="text-primary text-sm font-medium mt-2">{info.content}</p>
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
                  Preencha o formulário abaixo e nossa equipe entrará em contato com você o mais breve possível.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Nome
                      </label>
                      <Input type="text" id="name" name="name" placeholder="Seu nome" required={true} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        E-mail
                      </label>
                      <Input name="email" id="email" type="email" placeholder="seu.email@exemplo.com" pattern="^\S+@\S+\.\S+$" required={true} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Telefone
                      </label>
                      <InputTel name="phone" id="phone" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        Empresa
                      </label>
                      <Input name="company" type="text" id="company" placeholder="Nome da empresa" required={true} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Assunto
                    </label>
                    <Input name="subject" type="text" id="subject" placeholder="Assunto da mensagem" required={true} />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mensagem
                    </label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Digite aqui o conteúdo da sua mensagem"
                      required={true}
                      name="message"
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
                  Estamos localizados no coentro de Porto Alegre, prontos para receber sua visita ou atender suas necessidades de engenharia.
                </p>
                <div className="mt-8 aspect-square rounded-lg bg-muted flex items-center justify-center border border-border">
                  <iframe className="aspect-square rounded-lg bg-muted flex items-center justify-center border border-border" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.3666821029556!2d-51.22483642535233!3d-30.02633643043536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95197909cbd6a5d3%3A0x44ad2c623eb01216!2sOptare%20Engenharia!5e0!3m2!1spt-BR!2sbr!4v1776107636756!5m2!1spt-BR!2sbr"></iframe>
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
