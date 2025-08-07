import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Eye, Shield, Lightbulb, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { LionLogo } from "@/assets/lion-logo";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header title="Quiénes Somos" toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex items-center mb-6">
              <Link href="/">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h2 className="text-xl font-semibold">Quiénes Somos</h2>
            </div>
          </div>
          
          <div className="mb-8 text-center">
            <LionLogo className="w-24 h-24 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Lion Heart Capital S.A.S.</h2>
            <p className="text-gray-400 mb-6">CONSULTORA FINANCIERA Y DE INVERSIÓN</p>
          </div>
          
          <Card className="bg-primary border-gray-800 mb-6">
            <CardContent className="pt-6">
              <p className="text-gray-300 mb-4">
                Somos una empresa especializada en brindar soluciones estratégicas financieras y de inversión. 
                Nos enfocamos en la gestión de portafolios diversificados, análisis de mercados globales y trading 
                en acciones, criptomonedas, ETFs, bonos y bienes raíces. Utilizamos inteligencia artificial y modelos 
                automatizados para optimizar decisiones de inversión y minimizar riesgos, ofreciendo soluciones 
                innovadoras y personalizadas para el crecimiento financiero y la preservación del capital de nuestros clientes.
              </p>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Target className="text-yellow-500 text-xl mr-3" />
              <h3 className="text-lg font-semibold">Misión</h3>
            </div>
            <Card className="bg-primary border-gray-800">
              <CardContent className="pt-6">
                <p className="text-gray-300">
                  En Lion Heart Capital S.A.S., somos una empresa innovadora en el sector financiero y de inversiones 
                  que combina el poder de las nuevas tecnologías con un enfoque estratégico para ofrecer soluciones 
                  de inversión inteligentes. Nuestro propósito es empoderar a nuestros clientes con herramientas avanzadas, 
                  análisis de alto impacto y estrategias personalizadas que maximicen su rentabilidad, minimicen riesgos 
                  y fomenten el crecimiento sostenible en un mundo financiero en constante evolución.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Eye className="text-yellow-500 text-xl mr-3" />
              <h3 className="text-lg font-semibold">Visión</h3>
            </div>
            <Card className="bg-primary border-gray-800">
              <CardContent className="pt-6">
                <p className="text-gray-300">
                  Ser reconocidos como líderes en el mercado global de finanzas e inversiones, integrando tecnología 
                  de vanguardia e inteligencia artificial para transformar la manera en que las personas y las empresas 
                  gestionan su capital. Aspiramos a crear un ecosistema financiero innovador y accesible, que inspire 
                  confianza y fomente el progreso económico de nuestros clientes y aliados estratégicos, posicionándonos 
                  como un referente en inversiones inteligentes y sustentables.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Nuestro Equipo</h3>
            <Card className="bg-primary border-gray-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center md:flex-row md:items-start">
                  <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 md:mb-0 md:mr-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Juan Pablo Arango</h4>
                    <p className="text-yellow-500 mb-2">CEO & Founder</p>
                    <p className="text-sm text-gray-300">
                      Especialista en finanzas corporativas y mercados globales con más de 10 años de experiencia 
                      en gestión de inversiones y análisis financiero.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-primary border-gray-800 mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Nuestros Valores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary-light p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <Shield className="text-yellow-500 mr-2 h-4 w-4" />
                    <h4 className="font-medium">Integridad</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Actuamos con transparencia y honestidad en todas nuestras operaciones y relaciones con clientes.
                  </p>
                </div>
                <div className="bg-primary-light p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="text-yellow-500 mr-2 h-4 w-4" />
                    <h4 className="font-medium">Innovación</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Buscamos constantemente nuevas tecnologías y métodos para mejorar nuestros servicios y resultados.
                  </p>
                </div>
                <div className="bg-primary-light p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <Users className="text-yellow-500 mr-2 h-4 w-4" />
                    <h4 className="font-medium">Enfoque al Cliente</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Las necesidades y objetivos de nuestros clientes son nuestra máxima prioridad.
                  </p>
                </div>
                <div className="bg-primary-light p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="text-yellow-500 mr-2 h-4 w-4" />
                    <h4 className="font-medium">Excelencia</h4>
                  </div>
                  <p className="text-sm text-gray-400">
                    Nos comprometemos a ofrecer el más alto nivel de calidad en nuestros servicios y análisis.
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
