import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface AiLessonProps {
  topicId: string;
  topicName: string;
  topicDesc: string;
  levelName: string;
  levelId: string;
  onClose: () => void;
}

interface LessonResponse {
  emoji: string;
  title: string;
  hook: string;
  concept: string;
  example: string;
  keyFact: string;
  challenge: string;
}

export default function AiLesson({
  topicId,
  topicName,
  topicDesc,
  levelName,
  levelId,
  onClose,
}: AiLessonProps) {
  const { data: lesson, isLoading, error } = useQuery<LessonResponse>({
    queryKey: ["/api/financiaplay/lesson", topicId, levelId],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/financiaplay/lesson", {
        topicId,
        topicName,
        topicDesc,
        levelName,
        levelId,
      });
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !lesson) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-muted-foreground">
            No se pudo generar la lección. Intenta de nuevo.
          </p>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">
              {lesson.emoji} {lesson.title}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Hook */}
          <p className="italic text-muted-foreground text-sm">
            {lesson.hook}
          </p>

          {/* Concept */}
          <div className="text-sm leading-relaxed">{lesson.concept}</div>

          {/* Example */}
          <div className="rounded-lg border border-[#FFC107]/30 bg-[#FFC107]/5 p-4">
            <p className="text-sm font-medium mb-1 text-[#FFC107]">Ejemplo</p>
            <p className="text-sm">{lesson.example}</p>
          </div>

          {/* Key Fact */}
          <div className="flex items-start gap-3 text-sm">
            <Lightbulb className="h-5 w-5 text-[#FFC107] shrink-0 mt-0.5" />
            <p>{lesson.keyFact}</p>
          </div>

          {/* Challenge */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-1">🎯 Desafío</p>
              <p className="text-sm text-muted-foreground">{lesson.challenge}</p>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={onClose} className="w-full">
            Cerrar lección
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
