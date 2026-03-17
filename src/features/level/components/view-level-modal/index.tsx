"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { useGetLevelByIdQuery } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";

import { levelDefaultValues } from "../../common";
import { getLevelSchema, type LevelFormValues } from "../../schemas";
import { LevelForm } from "../level-form";

interface ViewLevelModalProps {
  levelId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewLevelModal({
  levelId,
  open: controlledOpen,
  onOpenChange,
}: ViewLevelModalProps) {
  const t = useTranslations();
  const {
    data: levelData,
    isLoading,
    isError,
  } = useGetLevelByIdQuery(levelId || EMPTY.str);

  const levelSchema = useMemo(() => getLevelSchema(t), [t]);

  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelSchema) as Resolver<LevelFormValues>,
    defaultValues: levelDefaultValues,
  });

  const { reset } = form;

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

  const handleClose = () => {
    reset(levelDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.level.level_details")}
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
      title={t("feature.level.level_details")}
      description={t("feature.level.level_details_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-6">
          <LevelForm form={form} mode={MODES.view} />
        </form>
      </Form>
    </ModalCustom>
  );
}
