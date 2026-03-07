import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InvestorQuestionnaire } from "@/components/finance/investor-questionnaire";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface InvestorProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function InvestorProfileModal({ open, onClose }: InvestorProfileModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const submitMutation = useMutation({
    mutationFn: async (answers: Record<number, number>) => {
      return apiRequest("POST", "/api/investor-profile", { answers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investor-profile"] });
      toast({
        title: "¡Perfil completado!",
        description: "Tu perfil de inversor ha sido guardado exitosamente",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar tu perfil",
        variant: "destructive",
      });
    }
  });
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow closing after profile is completed
        if (!isOpen && submitMutation.isSuccess) {
          onClose();
        }
      }}
    >
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Completa tu Perfil de Inversor</DialogTitle>
          <DialogDescription>
            Para ofrecerte recomendaciones personalizadas y acceder a todas las funcionalidades 
            de la plataforma, necesitamos conocer tu perfil de riesgo como inversor. 
            Este cuestionario solo tomará unos minutos.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <InvestorQuestionnaire 
            onComplete={submitMutation.mutate}
            isLoading={submitMutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
