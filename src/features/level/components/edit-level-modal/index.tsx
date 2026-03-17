"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useGetLevelByIdQuery, useUpdateLevelMutation } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { levelDefaultValues } from "../../common";
import { getLevelSchema, type LevelFormValues } from "../../schemas";
import { LevelForm } from "../level-form";

interface EditLevelModalProps {
  levelId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditLevelModal({
  levelId,
  open: controlledOpen,
  onOpenChange,
}: EditLevelModalProps) {
  const t = useTranslations();
  const {
    data: levelData,
    isLoading,
    isError,
  } = useGetLevelByIdQuery(levelId || EMPTY.str);
  const { mutate: updateLevel, isPending } = useUpdateLevelMutation();

  const levelSchema = useMemo(() => getLevelSchema(t), [t]);

  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelSchema) as Resolver<LevelFormValues>,
    defaultValues: levelDefaultValues,
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (levelData?.data?.level && controlledOpen) {
      const level = levelData.data.level;
      reset({
        cefrLevel: level.cefrLevel ?? EMPTY.str,
        name: level.name ?? EMPTY.str,
        description: level.description ?? EMPTY.str,
        order: level.order ?? 0,
        status: level.status ?? true,
        ieltsMin: level.ieltsMin ?? 0,
        ieltsMax: level.ieltsMax ?? 0,
        toeicScoreMin: level.toeicScoreMin ?? 0,
        toeicScoreMax: level.toeicScoreMax ?? 0,
      });
    }
  }, [levelData, controlledOpen, reset]);

  useEffect(() => {
    if (!controlledOpen) {
      reset(levelDefaultValues);
    }
  }, [controlledOpen, reset]);

  const onSubmit: SubmitHandler<LevelFormValues> = (values) => {
    updateLevel(
      {
        id: levelId || EMPTY.str,
        payload: {
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
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || t("common.toast.update_success"));
          onOpenChange?.(false);
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.update_error")),
      },
    );
  };

  const handleCancel = () => {
    reset(levelDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.level.edit_level")}
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
        form="edit-level-form"
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
      title={t("feature.level.edit_level")}
      description={t("feature.level.edit_level_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form
          id="edit-level-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <LevelForm form={form} mode={MODES.edit} />
        </form>
      </Form>
    </ModalCustom>
  );
}
