import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Instagram, MessageCircle, Mail, Phone, Globe, Linkedin } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { SiTiktok } from "react-icons/si";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log(data);
    toast({
      title: "Mensaje enviado",
      description: "Gracias por contactarnos. Responderemos a la brevedad.",
    });
    form.reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="max-w-7xl mx-auto w-full py-4 px-4">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button className="mr-2 bg-primary text-black hover:bg-primary/90">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Regresar
            </Button>
          </Link>
          <h2 className="text-xl font-semibold">Contacto</h2>
        </div>
        
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold mb-2 text-primary">Contáctenos</h3>
          <p className="text-gray-400">Estamos aquí para ayudarte.</p>
        </div>
        
        <div className="bg-black border border-gray-800 shadow-lg max-w-xl mx-auto rounded-lg">
          <div className="p-6">
            <h4 className="text-lg font-medium mb-4 text-primary text-center">Envíanos un Mensaje</h4>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Nombre" 
                          className="bg-black/50 border-gray-700 focus:border-yellow-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Correo electrónico" 
                          className="bg-black/50 border-gray-700 focus:border-yellow-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Mensaje" 
                          rows={5} 
                          className="bg-black/50 border-gray-700 focus:border-yellow-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-center pt-2">
                  <Button 
                    type="submit" 
                    className="bg-black border border-primary hover:bg-primary/10 text-primary px-6"
                  >
                    Enviar Mensaje
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span className="flex items-center">
                  <Mail className="text-primary mr-1 h-3 w-3" />
                  lionheartcapital1303@gmail.com
                </span>
                <span className="flex items-center">
                  <Phone className="text-primary mr-1 h-3 w-3" />
                  +57 3163581762
                </span>
              </div>
            </div>
            
            <div className="mt-6 mb-6">
              <h3 className="text-center font-medium text-primary mb-3">Integración Blockchain</h3>
              <p className="text-xs text-gray-300 mb-3 text-center">
                Conecta tu wallet de Ethereum, Solana, Bitcoin para gestionar tus activos digitales y criptomonedas.
              </p>
              <div className="flex justify-center">
                <Button 
                  className="w-full max-w-xs bg-primary text-black hover:bg-primary/90 transition-colors"
                  onClick={() => window.location.href = "/wallet"}
                >
                  <span className="mr-2">📱</span>
                  Conectar Wallet
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-center font-medium text-primary mb-3">Síguenos</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-3">
                <a 
                  href="https://wa.me/573163581762" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a 
                  href="https://www.linkedin.com/company/lion-heart-capital-s-a-s/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a 
                  href="https://lion-heart-invest.replit.app/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Web"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a 
                  href="https://www.tiktok.com/@lionheart_1303?_t=ZS-8vAz4kEW3Q9&_r=1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="TikTok"
                >
                  <SiTiktok className="h-4 w-4" />
                </a>
                <a 
                  href="https://www.instagram.com/lion_heart__capital?igsh=eHhrOHNuZjBha3hs&utm_source=qr" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}