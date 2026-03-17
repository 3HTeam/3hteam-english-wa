"use client";

import { useParams } from "next/navigation";

import { MobileViewPlaceholder } from "@/components/shared/mobile-view-placeholder";
import { ExerciseDetailView } from "@/features/exercise/components/exercise-detail-view";
import { useTranslations } from "@/hooks";

export default function ExerciseDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const id = params.id as string;

  return (
    <>
      {/* Mobile view placeholder */}
      <MobileViewPlaceholder title={t("feature.exercise.exercise_details")} />

      {/* Desktop view */}
      <div className="hidden h-full flex-1 flex-col px-4 md:px-6 md:flex">
        <ExerciseDetailView id={id} />
      </div>
    </>
  );
}
