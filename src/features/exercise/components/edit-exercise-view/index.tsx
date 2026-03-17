import { toast } from "sonner";

import {
  useGetExerciseByIdQuery,
  useUpdateExerciseMutation,
} from "@/apis/hooks/exercise";
import { Skeleton } from "@/components/ui/skeleton";
import { MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { ExerciseFormValues } from "../../schemas";
import { ExerciseForm } from "../exercise-form";

interface EditExerciseViewProps {
  id: string;
}

export function EditExerciseView({ id }: EditExerciseViewProps) {
  const t = useTranslations();
  const { data, isLoading, error: getError } = useGetExerciseByIdQuery(id);
  const {
    mutate: updateExercise,
    isPending,
    error: updateError,
  } = useUpdateExerciseMutation();

  const exercise = data?.data?.exercise;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (getError || !exercise) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">{t("common.error.not_found")}</p>
      </div>
    );
  }

  const handleSubmit = (values: ExerciseFormValues) => {
    updateExercise(
      {
        id,
        payload: values,
      },
      {
        onSuccess: (data) => {
          toast.success(
            data.message ||
              t("common.toast.update_success", {
                item: t("feature.exercise.exercise"),
              }),
          );
        },
        onError: (error: Error) =>
          handleApiError(
            error,
            t("common.toast.update_error", {
              item: t("feature.exercise.exercise"),
            }),
          ),
      },
    );
  };

  return (
    <ExerciseForm
      mode={MODES.edit}
      initialData={exercise}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
    />
  );
}
