"use client";

import { useGetExerciseByIdQuery } from "@/apis/hooks/exercise";
import { Skeleton } from "@/components/ui/skeleton";
import { MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";

import { ExerciseForm } from "../exercise-form";

interface ExerciseDetailViewProps {
  id: string;
}

export function ExerciseDetailView({ id }: ExerciseDetailViewProps) {
  const t = useTranslations();
  const { data, isLoading, error } = useGetExerciseByIdQuery(id);

  const exercise = data?.data?.exercise;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">{t("common.error.not_found")}</p>
      </div>
    );
  }

  return <ExerciseForm mode={MODES.view} initialData={exercise} />;
}
