import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InvestorQuestionnaire } from "@/components/finance/investor-questionnaire";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface InvestorProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function InvestorProfileModal({
  open,
  onClose,
}: InvestorProfileModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);

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
      setIsCompleted(true);
      // NO cerrar aquí - el usuario decide cuándo
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar tu perfil",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && isCompleted) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => !isCompleted && e.preventDefault()}
        onEscapeKeyDown={(e) => !isCompleted && e.preventDefault()}
        showCloseButton={isCompleted}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Completa tu Perfil de Inversor
          </DialogTitle>
          <DialogDescription>
            Para ofrecerte recomendaciones personalizadas y acceder a todas las
            funcionalidades de la plataforma, necesitamos conocer tu perfil de
            riesgo como inversor. Este cuestionario solo tomará unos minutos.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <InvestorQuestionnaire
            onComplete={submitMutation.mutate}
            isLoading={submitMutation.isPending}
            onClose={handleClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
