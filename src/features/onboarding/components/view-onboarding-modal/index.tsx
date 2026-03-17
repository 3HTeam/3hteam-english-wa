"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useGetOnboardingByIdQuery } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";

import { onboardingDefaultValues } from "../../common";
import { getOnboardingSchema, type OnboardingFormValues } from "../../schemas";
import OnboardingForm from "../modal-form";

interface ViewOnboardingModalProps {
  onboardingId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewOnboardingModal({
  onboardingId,
  open: controlledOpen,
  onOpenChange,
}: ViewOnboardingModalProps) {
  const t = useTranslations();
  const {
    data: onboardingData,
    isLoading,
    isError,
  } = useGetOnboardingByIdQuery(onboardingId || EMPTY.str);

  const onboardingSchema = useMemo(() => getOnboardingSchema(t), [t]);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: onboardingDefaultValues,
  });

  const { reset } = form;

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

  const handleClose = () => {
    reset(onboardingDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.onboarding.onboarding_details")}
        onClose={handleClose}
      />
    );
  }

  const footer = (
    <div className="flex justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={handleClose}
        className="cursor-pointer"
      >
        {t("common.actions.close")}
      </Button>
    </div>
  );

  return (
    <ModalCustom
      open={controlledOpen ?? false}
      onOpenChange={onOpenChange ?? (() => {})}
      title={t("feature.onboarding.onboarding_details")}
      description={t("feature.onboarding.onboarding_details_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-6">
          <OnboardingForm form={form} mode={MODES.view} />
        </form>
      </Form>
    </ModalCustom>
  );
}
