"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useGetBannerByIdQuery, useUpdateBannerMutation } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { bannerDefaultValues } from "../../common";
import { getBannerSchema, type BannerFormValues } from "../../schemas";
import BannerForm from "../modal-form";

interface EditBannerModalProps {
  bannerId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditBannerModal({
  bannerId,
  open: controlledOpen,
  onOpenChange,
}: EditBannerModalProps) {
  const t = useTranslations();
  const {
    data: bannerData,
    isLoading,
    isError,
  } = useGetBannerByIdQuery(bannerId || EMPTY.str);
  const { mutate: updateBanner, isPending } = useUpdateBannerMutation();

  const bannerSchema = useMemo(() => getBannerSchema(t), [t]);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: bannerDefaultValues,
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (bannerData?.data?.banner && controlledOpen) {
      const banner = bannerData.data.banner;
      reset({
        title: banner.title,
        imageUrl: banner.imageUrl || EMPTY.str,
        description: banner.description || EMPTY.str,
        status: banner.status,
        moduleId: banner.moduleId,
      });
    }
  }, [bannerData, controlledOpen, reset]);

  useEffect(() => {
    if (!controlledOpen) {
      reset(bannerDefaultValues);
    }
  }, [controlledOpen, reset]);

  const onSubmit: SubmitHandler<BannerFormValues> = (values) => {
    updateBanner(
      {
        id: bannerId || EMPTY.str,
        payload: {
          title: values.title,
          imageUrl: values.imageUrl || EMPTY.str,
          description: values.description || EMPTY.str,
          status: values.status,
          moduleId: values.moduleId,
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
    reset(bannerDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.banner.edit_banner")}
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
        form="edit-banner-form"
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
      title={t("feature.banner.edit_banner")}
      description={t("feature.banner.edit_banner_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form
          id="edit-banner-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <BannerForm form={form} mode={MODES.edit} />
        </form>
      </Form>
    </ModalCustom>
  );
}
