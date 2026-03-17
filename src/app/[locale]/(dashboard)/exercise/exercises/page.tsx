"use client";

import { MobileViewPlaceholder } from "@/components/shared/mobile-view-placeholder";
import ExerciseView from "@/features/exercise";
import { useTranslations } from "@/hooks";

export default function ExercisesPage() {
  const t = useTranslations();
  return (
    <>
      {/* Mobile view placeholder - shows message instead of images */}
      <MobileViewPlaceholder title={t("feature.exercise.exercises")} />

      {/* Desktop view */}
      <div className="hidden h-full flex-1 flex-col px-4 md:px-6 md:flex">
        <ExerciseView />
      </div>
    </>
  );
}
