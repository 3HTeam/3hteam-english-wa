"use client";

import React, { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useCreateModuleMutation } from "@/apis/hooks";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { moduleDefaultValues } from "../../common";
import { getModuleSchema, ModuleFormValues } from "../../schemas";
import ModuleForm from "../module-form";

interface AddModuleModalProps {
  trigger?: React.ReactNode;
}

export function AddModuleModal({ trigger }: AddModuleModalProps) {
  const t = useTranslations();
  const { mutate: createModule, isPending } = useCreateModuleMutation();
  const [open, setOpen] = useState<boolean>(false);

  const moduleSchema = useMemo(() => getModuleSchema(t), [t]);

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: moduleDefaultValues,
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<ModuleFormValues> = (values) => {
    createModule(
      {
        name: values.name,
        description: values.description || EMPTY.str,
        status: values.status,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || t("common.toast.create_success"));
          reset(moduleDefaultValues);
          setOpen(false);
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.create_error")),
      },
    );
  };

  const handleCancel = () => {
    reset(moduleDefaultValues);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="default" size="sm" className="cursor-pointer">
      <Plus className="w-4 h-4" />
      <span className="hidden lg:inline">
        {t("feature.module.add_new_module")}
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
        form="add-module-form"
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
      title={t("feature.module.add_new_module")}
      description={t("feature.module.add_new_module_desc")}
      trigger={trigger || defaultTrigger}
      footer={footer}
    >
      <Form {...form}>
        <form
          id="add-module-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <ModuleForm form={form} mode={MODES.add} />
        </form>
      </Form>
    </ModalCustom>
  );
}
