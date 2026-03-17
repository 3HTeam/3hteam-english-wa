"use client";

import { MobileViewPlaceholder } from "@/components/shared/mobile-view-placeholder";
import { AddExerciseView } from "@/features/exercise/components/add-exercise-view";
import { useTranslations } from "@/hooks";

export default function AddExercisePage() {
  const t = useTranslations();
  return (
    <>
      {/* Mobile view placeholder */}
      <MobileViewPlaceholder title={t("feature.exercise.add_new_exercise")} />

      {/* Desktop view */}
      <div className="hidden h-full flex-1 flex-col px-4 md:px-6 md:flex">
        <AddExerciseView />
      </div>
    </>
  );
}
