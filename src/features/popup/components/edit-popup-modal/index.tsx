"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useGetPopupByIdQuery, useUpdatePopupMutation } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { popupDefaultValues } from "../../common";
import { getPopupSchema, type PopupFormValues } from "../../schemas";
import PopupForm from "../modal-form";

interface EditPopupModalProps {
  popupId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditPopupModal({
  popupId,
  open: controlledOpen,
  onOpenChange,
}: EditPopupModalProps) {
  const t = useTranslations();
  const {
    data: popupData,
    isLoading,
    isError,
  } = useGetPopupByIdQuery(popupId || EMPTY.str);
  const { mutate: updatePopup, isPending } = useUpdatePopupMutation();

  const popupSchema = useMemo(() => getPopupSchema(t), [t]);

  const form = useForm<PopupFormValues>({
    resolver: zodResolver(popupSchema),
    defaultValues: popupDefaultValues,
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (popupData?.data?.popup && controlledOpen) {
      const popup = popupData.data.popup;
      reset({
        title: popup.title,
        imageUrl: popup.imageUrl || EMPTY.str,
        description: popup.description || EMPTY.str,
        status: popup.status,
        moduleId: popup.moduleId,
      });
    }
  }, [popupData, controlledOpen, reset]);

  useEffect(() => {
    if (!controlledOpen) {
      reset(popupDefaultValues);
    }
  }, [controlledOpen, reset]);

  const onSubmit: SubmitHandler<PopupFormValues> = (values) => {
    updatePopup(
      {
        id: popupId || EMPTY.str,
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
    reset(popupDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.popup.edit_popup")}
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
        form="edit-popup-form"
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
      title={t("feature.popup.edit_popup")}
      description={t("feature.popup.edit_popup_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form
          id="edit-popup-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <PopupForm form={form} mode={MODES.edit} />
        </form>
      </Form>
    </ModalCustom>
  );
}
