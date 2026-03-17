"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useGetBannerByIdQuery } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";

import { bannerDefaultValues } from "../../common";
import { getBannerSchema, type BannerFormValues } from "../../schemas";
import BannerForm from "../modal-form";

interface ViewBannerModalProps {
  bannerId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewBannerModal({
  bannerId,
  open: controlledOpen,
  onOpenChange,
}: ViewBannerModalProps) {
  const t = useTranslations();
  const {
    data: bannerData,
    isLoading,
    isError,
  } = useGetBannerByIdQuery(bannerId || EMPTY.str);

  const bannerSchema = useMemo(() => getBannerSchema(t), [t]);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: bannerDefaultValues,
  });

  const { reset } = form;

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

  const handleClose = () => {
    reset(bannerDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.banner.banner_details")}
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
      title={t("feature.banner.banner_details")}
      description={t("feature.banner.banner_details_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-6">
          <BannerForm form={form} mode={MODES.view} />
        </form>
      </Form>
    </ModalCustom>
  );
}
