"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import {
  useGetOnboardingByIdQuery,
  useUpdateOnboardingMutation,
} from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { onboardingDefaultValues } from "../../common";
import { getOnboardingSchema, type OnboardingFormValues } from "../../schemas";
import OnboardingForm from "../modal-form";

interface EditOnboardingModalProps {
  onboardingId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditOnboardingModal({
  onboardingId,
  open: controlledOpen,
  onOpenChange,
}: EditOnboardingModalProps) {
  const t = useTranslations();
  const {
    data: onboardingData,
    isLoading,
    isError,
  } = useGetOnboardingByIdQuery(onboardingId || EMPTY.str);
  const { mutate: updateOnboarding, isPending } = useUpdateOnboardingMutation();

  const onboardingSchema = useMemo(() => getOnboardingSchema(t), [t]);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: onboardingDefaultValues,
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (onboardingData?.data?.onboarding && controlledOpen) {
      const onboarding = onboardingData.data.onboarding;
      reset({
        title: onboarding.title,
        imageUrl: onboarding.imageUrl || EMPTY.str,
        description: onboarding.description || EMPTY.str,
        status: onboarding.status,
      });
    }
  }, [onboardingData, controlledOpen, reset]);

  useEffect(() => {
    if (!controlledOpen) {
      reset(onboardingDefaultValues);
    }
  }, [controlledOpen, reset]);

  const onSubmit: SubmitHandler<OnboardingFormValues> = (values) => {
    updateOnboarding(
      {
        id: onboardingId || EMPTY.str,
        payload: {
          title: values.title,
          imageUrl: values.imageUrl || EMPTY.str,
          description: values.description || EMPTY.str,
          status: values.status,
        },
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || t("common.toast.update_success"));
          onOpenChange?.(false);
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.update_error")),
      },
    );
  };

  const handleCancel = () => {
    reset(onboardingDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.onboarding.edit_onboarding")}
        onClose={handleCancel}
      />
    );
  }

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        className="cursor-pointer"
      >
        {t("common.actions.cancel")}
      </Button>
      <Button
        type="submit"
        form="edit-onboarding-form"
        className="cursor-pointer min-w-[130px]"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("common.actions.saving")}
          </>
        ) : (
          <>
            <Pencil className="w-4 h-4 mr-2" />
            {t("common.actions.update")}
          </>
        )}
      </Button>
    </div>
  );

  return (
    <ModalCustom
      open={controlledOpen ?? false}
      onOpenChange={onOpenChange ?? (() => {})}
      title={t("feature.onboarding.edit_onboarding")}
      description={t("feature.onboarding.edit_onboarding_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form
          id="edit-onboarding-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <OnboardingForm form={form} mode={MODES.edit} />
        </form>
      </Form>
    </ModalCustom>
  );
}
