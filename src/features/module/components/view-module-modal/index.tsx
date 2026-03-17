"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useGetModuleByIdQuery } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";

import { moduleDefaultValues } from "../../common";
import { getModuleSchema, type ModuleFormValues } from "../../schemas";
import ModuleForm from "../module-form";

interface ViewModuleModalProps {
  moduleId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewModuleModal({
  moduleId,
  open: controlledOpen,
  onOpenChange,
}: ViewModuleModalProps) {
  const t = useTranslations();
  const {
    data: moduleData,
    isLoading,
    isError,
  } = useGetModuleByIdQuery(moduleId || EMPTY.str);

  const moduleSchema = useMemo(() => getModuleSchema(t), [t]);

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: moduleDefaultValues,
  });

  const { reset } = form;

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

  const handleClose = () => {
    reset(moduleDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.module.module_details")}
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
      title={t("feature.module.module_details")}
      description={t("feature.module.module_details_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-6">
          <ModuleForm form={form} mode={MODES.view} />
        </form>
      </Form>
    </ModalCustom>
  );
}
