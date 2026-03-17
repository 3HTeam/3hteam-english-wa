"use client";

import { toast } from "sonner";

import { useCreateExerciseMutation } from "@/apis/hooks/exercise";
import { MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { TExercisePayload } from "@/types/features";
import { handleApiError } from "@/utils/api/handle-api-error";

import { type ExerciseFormValues } from "../../schemas";
import { ExerciseForm } from "../exercise-form";

export function AddExerciseView() {
  const t = useTranslations();

  const { mutate: createExercise, isPending } = useCreateExerciseMutation();

  const onSubmit = (values: ExerciseFormValues, reset: () => void) => {
    const payload: TExercisePayload = {
      ...values,
      topicId: values.topicId || null,
      grammarTopicId: values.grammarTopicId || null,
      mediaUrl: values.mediaUrl || null,
      mediaType: values.mediaType ?? null,
    };

    createExercise(payload, {
      onSuccess: (data) => {
        toast.success(data?.message || t("common.toast.create_success"));
        reset();
      },
      onError: (error: Error) =>
        handleApiError(error, t("common.toast.create_error")),
    });
  };

  return (
    <ExerciseForm
      mode={MODES.add}
      onSubmit={onSubmit}
      isSubmitting={isPending}
    />
  );
}
