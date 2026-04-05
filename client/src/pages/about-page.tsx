import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Target,
  Eye,
  Shield,
  Lightbulb,
  Users,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";
import { LionLogo } from "@/assets/lion-logo";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background flex h-screen flex-col">
      <Header
        title="Quiénes Somos"
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="mb-6 flex items-center">
              <Link href="/">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h2 className="text-xl font-semibold">Quiénes Somos</h2>
            </div>
          </div>

          <div className="mb-8 text-center">
            <LionLogo className="mx-auto mb-4 h-24 w-24" />
            <h2 className="text-2xl font-bold">Zupi Fintech</h2>
            <p className="mb-6 text-gray-400">
              CONSULTORA FINANCIERA Y DE INVERSIÓN
            </p>
          </div>

          <Card className="bg-primary mb-6 border-gray-800">
            <CardContent className="pt-6">
              <p className="mb-4 text-gray-300">
                Somos una empresa especializada en brindar soluciones
                estratégicas financieras y de inversión. Nos enfocamos en la
                gestión de portafolios diversificados, análisis de mercados
                globales y trading en acciones, criptomonedas, ETFs, bonos y
                bienes raíces. Utilizamos inteligencia artificial y modelos
                automatizados para optimizar decisiones de inversión y minimizar
                riesgos, ofreciendo soluciones innovadoras y personalizadas para
                el crecimiento financiero y la preservación del capital de
                nuestros clientes.
              </p>
            </CardContent>
          </Card>

          <div className="mb-6">
            <div className="mb-4 flex items-center">
              <Target className="mr-3 text-xl text-yellow-500" />
              <h3 className="text-lg font-semibold">Misión</h3>
            </div>
            <Card className="bg-primary border-gray-800">
              <CardContent className="pt-6">
                <p className="text-gray-300">
                  En Zupi Fintech, somos una empresa innovadora en el sector
                  financiero y de inversiones que combina el poder de las nuevas
                  tecnologías con un enfoque estratégico para ofrecer soluciones
                  de inversión inteligentes. Nuestro propósito es empoderar a
                  nuestros clientes con herramientas avanzadas, análisis de alto
                  impacto y estrategias personalizadas que maximicen su
                  rentabilidad, minimicen riesgos y fomenten el crecimiento
                  sostenible en un mundo financiero en constante evolución.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <div className="mb-4 flex items-center">
              <Eye className="mr-3 text-xl text-yellow-500" />
              <h3 className="text-lg font-semibold">Visión</h3>
            </div>
            <Card className="bg-primary border-gray-800">
              <CardContent className="pt-6">
                <p className="text-gray-300">
                  Ser reconocidos como líderes en el mercado global de finanzas
                  e inversiones, integrando tecnología de vanguardia e
                  inteligencia artificial para transformar la manera en que las
                  personas y las empresas gestionan su capital. Aspiramos a
                  crear un ecosistema financiero innovador y accesible, que
                  inspire confianza y fomente el progreso económico de nuestros
                  clientes y aliados estratégicos, posicionándonos como un
                  referente en inversiones inteligentes y sustentables.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold">Nuestro Equipo</h3>
            <Card className="bg-primary border-gray-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center md:flex-row md:items-start">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-700 md:mr-4 md:mb-0">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Juan Pablo Arango</h4>
                    <p className="mb-2 text-yellow-500">CEO & Founder</p>
                    <p className="text-sm text-gray-300">
                      Especialista en finanzas corporativas y mercados globales
                      con más de 10 años de experiencia en gestión de
                      inversiones y análisis financiero.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary mb-6 border-gray-800">
            <CardContent className="pt-6">
              <h3 className="mb-4 text-lg font-semibold">Nuestros Valores</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="bg-primary-light rounded-md p-4">
                  <div className="mb-2 flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium">Integridad</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Actuamos con transparencia y honestidad en todas nuestras
                    operaciones y relaciones con clientes.
                  </p>
                </div>
                <div className="bg-primary-light rounded-md p-4">
                  <div className="mb-2 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium">Innovación</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Buscamos constantemente nuevas tecnologías y métodos para
                    mejorar nuestros servicios y resultados.
                  </p>
                </div>
                <div className="bg-primary-light rounded-md p-4">
                  <div className="mb-2 flex items-center">
                    <Users className="mr-2 h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium">Enfoque al Cliente</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Las necesidades y objetivos de nuestros clientes son nuestra
                    máxima prioridad.
                  </p>
                </div>
                <div className="bg-primary-light rounded-md p-4">
                  <div className="mb-2 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium">Excelencia</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Nos comprometemos a ofrecer el más alto nivel de calidad en
                    nuestros servicios y análisis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
