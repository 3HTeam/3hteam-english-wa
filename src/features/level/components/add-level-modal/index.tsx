"use client";

import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useCreateLevelMutation } from "@/apis/hooks";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { levelDefaultValues } from "../../common";
import { getLevelSchema, type LevelFormValues } from "../../schemas";
import { LevelForm } from "../level-form";

interface AddLevelModalProps {
  trigger?: React.ReactNode;
}

export function AddLevelModal({ trigger }: AddLevelModalProps) {
  const t = useTranslations();
  const { mutate: createLevel, isPending } = useCreateLevelMutation();
  const [open, setOpen] = useState(false);

  const levelSchema = useMemo(() => getLevelSchema(t), [t]);

  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelSchema) as Resolver<LevelFormValues>,
    defaultValues: levelDefaultValues,
  });

  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<LevelFormValues> = (values) => {
    createLevel(
      {
        cefrLevel: values.cefrLevel,
        name: values.name,
        description: values.description || EMPTY.str,
        order: Number(values.order),
        status: values.status,
        toeicScoreMin: Number(values.toeicScoreMin ?? 0),
        toeicScoreMax: Number(values.toeicScoreMax ?? 0),
        ieltsMin: Number(values.ieltsMin ?? 0),
        ieltsMax: Number(values.ieltsMax ?? 0),
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || t("common.toast.create_success"));
          reset(levelDefaultValues);
          setOpen(false);
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.create_error")),
      },
    );
  };

  const handleCancel = () => {
    reset(levelDefaultValues);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="default" size="sm" className="cursor-pointer">
      <Plus className="w-4 h-4" />
      <span className="hidden lg:inline">
        {t("feature.level.add_new_level")}
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
        form="add-level-form"
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
      title={t("feature.level.add_new_level")}
      description={t("feature.level.add_new_level_desc")}
      trigger={trigger || defaultTrigger}
      footer={footer}
    >
      <Form {...form}>
        <form
          id="add-level-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <LevelForm form={form} mode={MODES.add} />
        </form>
      </Form>
    </ModalCustom>
  );
}
