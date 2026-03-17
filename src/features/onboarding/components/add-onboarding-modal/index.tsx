"use client";

import React, { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useCreateOnboardingMutation } from "@/apis/hooks";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { onboardingDefaultValues } from "../../common";
import { getOnboardingSchema, OnboardingFormValues } from "../../schemas";
import OnboardingForm from "../modal-form";

interface AddOnboardingModalProps {
  trigger?: React.ReactNode;
}

export function AddOnboardingModal({ trigger }: AddOnboardingModalProps) {
  const t = useTranslations();
  const { mutate: createOnboarding, isPending } = useCreateOnboardingMutation();
  const [open, setOpen] = useState<boolean>(false);

  const onboardingSchema = useMemo(() => getOnboardingSchema(t), [t]);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: onboardingDefaultValues,
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<OnboardingFormValues> = (values) => {
    createOnboarding(
      {
        title: values.title,
        imageUrl: values.imageUrl || EMPTY.str,
        description: values.description || EMPTY.str,
        status: values.status,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || t("common.toast.create_success"));
          reset(onboardingDefaultValues);
          setOpen(false);
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.create_error")),
      },
    );
  };

  const handleCancel = () => {
    reset(onboardingDefaultValues);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="default" size="sm" className="cursor-pointer">
      <Plus className="w-4 h-4" />
      <span className="hidden lg:inline">
        {t("feature.onboarding.add_new_onboarding")}
      </span>
    </Button>
  );

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
        form="add-onboarding-form"
        className="cursor-pointer min-w-[120px]"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("common.actions.saving")}
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            {t("common.actions.add")}
          </>
        )}
      </Button>
    </div>
  );

  return (
    <ModalCustom
      open={open}
      onOpenChange={setOpen}
      title={t("feature.onboarding.add_new_onboarding")}
      description={t("feature.onboarding.add_new_onboarding_desc")}
      trigger={trigger || defaultTrigger}
      footer={footer}
    >
      <Form {...form}>
        <form
          id="add-onboarding-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <OnboardingForm form={form} mode={MODES.add} />
        </form>
      </Form>
    </ModalCustom>
  );
}
