"use client";

import React, { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useCreateBannerMutation } from "@/apis/hooks";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { bannerDefaultValues } from "../../common";
import { BannerFormValues, getBannerSchema } from "../../schemas";
import BannerForm from "../modal-form";

interface AddBannerModalProps {
  trigger?: React.ReactNode;
}

export function AddBannerModal({ trigger }: AddBannerModalProps) {
  const t = useTranslations();
  const { mutate: createBanner, isPending } = useCreateBannerMutation();
  const [open, setOpen] = useState<boolean>(false);

  const bannerSchema = useMemo(() => getBannerSchema(t), [t]);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: bannerDefaultValues,
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<BannerFormValues> = (values) => {
    createBanner(
      {
        title: values.title,
        imageUrl: values.imageUrl || EMPTY.str,
        description: values.description || EMPTY.str,
        status: values.status,
        moduleId: values.moduleId,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || t("common.toast.create_success"));
          reset(bannerDefaultValues);
          setOpen(false);
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.create_error")),
      },
    );
  };

  const handleCancel = () => {
    reset(bannerDefaultValues);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="default" size="sm" className="cursor-pointer">
      <Plus className="w-4 h-4" />
      <span className="hidden lg:inline">
        {t("feature.banner.add_new_banner")}
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
        form="add-banner-form"
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
      title={t("feature.banner.add_new_banner")}
      description={t("feature.banner.add_new_banner_desc")}
      trigger={trigger || defaultTrigger}
      footer={footer}
    >
      <Form {...form}>
        <form
          id="add-banner-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <BannerForm form={form} mode={MODES.add} />
        </form>
      </Form>
    </ModalCustom>
  );
}
