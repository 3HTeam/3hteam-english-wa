"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useGetModuleByIdQuery, useUpdateModuleMutation } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { moduleDefaultValues } from "../../common";
import { getModuleSchema, type ModuleFormValues } from "../../schemas";
import ModuleForm from "../module-form";

interface EditModuleModalProps {
  moduleId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditModuleModal({
  moduleId,
  open: controlledOpen,
  onOpenChange,
}: EditModuleModalProps) {
  const t = useTranslations();
  const {
    data: moduleData,
    isLoading,
    isError,
  } = useGetModuleByIdQuery(moduleId || EMPTY.str);
  const { mutate: updateModule, isPending } = useUpdateModuleMutation();

  const moduleSchema = useMemo(() => getModuleSchema(t), [t]);

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: moduleDefaultValues,
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (moduleData?.data?.module && controlledOpen) {
      const module = moduleData.data.module;
      reset({
        name: module.name,
        description: module.description || EMPTY.str,
        status: module.status,
      });
    }
  }, [moduleData, controlledOpen, reset]);

  useEffect(() => {
    if (!controlledOpen) {
      reset(moduleDefaultValues);
    }
  }, [controlledOpen, reset]);

  const onSubmit: SubmitHandler<ModuleFormValues> = (values) => {
    updateModule(
      {
        id: moduleId || EMPTY.str,
        payload: {
          name: values.name,
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
    reset(moduleDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.module.edit_module")}
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
        form="edit-module-form"
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
      title={t("feature.module.edit_module")}
      description={t("feature.module.edit_module_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form
          id="edit-module-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <ModuleForm form={form} mode={MODES.edit} />
        </form>
      </Form>
    </ModalCustom>
  );
}
