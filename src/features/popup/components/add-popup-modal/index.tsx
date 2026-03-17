"use client";

import React, { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useCreatePopupMutation } from "@/apis/hooks";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { popupDefaultValues } from "../../common";
import { getPopupSchema, PopupFormValues } from "../../schemas";
import PopupForm from "../modal-form";

interface AddPopupModalProps {
  trigger?: React.ReactNode;
}

export function AddPopupModal({ trigger }: AddPopupModalProps) {
  const t = useTranslations();
  const { mutate: createPopup, isPending } = useCreatePopupMutation();
  const [open, setOpen] = useState<boolean>(false);

  const popupSchema = useMemo(() => getPopupSchema(t), [t]);

  const form = useForm<PopupFormValues>({
    resolver: zodResolver(popupSchema),
    defaultValues: popupDefaultValues,
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<PopupFormValues> = (values) => {
    createPopup(
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
          reset(popupDefaultValues);
          setOpen(false);
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.create_error")),
      },
    );
  };

  const handleCancel = () => {
    reset(popupDefaultValues);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="default" size="sm" className="cursor-pointer">
      <Plus className="w-4 h-4" />
      <span className="hidden lg:inline">
        {t("feature.popup.add_new_popup")}
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
        form="add-popup-form"
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
      title={t("feature.popup.add_new_popup")}
      description={t("feature.popup.add_new_popup_desc")}
      trigger={trigger || defaultTrigger}
      footer={footer}
    >
      <Form {...form}>
        <form
          id="add-popup-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <PopupForm form={form} mode={MODES.add} />
        </form>
      </Form>
    </ModalCustom>
  );
}
