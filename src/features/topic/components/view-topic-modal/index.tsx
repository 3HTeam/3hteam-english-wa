"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useGetTopicByIdQuery } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";

import { topicDefaultValues } from "../../common";
import { getTopicSchema, type TopicFormValues } from "../../schemas";
import { TopicForm } from "../topic-form";

interface ViewTopicModalProps {
  topicId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewTopicModal({
  topicId,
  open: controlledOpen,
  onOpenChange,
}: ViewTopicModalProps) {
  const t = useTranslations();
  const {
    data: topicData,
    isLoading,
    isError,
  } = useGetTopicByIdQuery(topicId || EMPTY.str);

  const topicSchema = useMemo(() => getTopicSchema(t), [t]);

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: topicDefaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    if (topicData?.data?.topic && controlledOpen) {
      const topic = topicData.data.topic;
      reset({
        name: topic.name,
        slug: topic.slug,
        description: topic.description || EMPTY.str,
        imageUrl: topic.imageUrl,
        status: topic.status,
      });
    }
  }, [topicData, controlledOpen, reset]);

  useEffect(() => {
    if (!controlledOpen) {
      reset(topicDefaultValues);
    }
  }, [controlledOpen, reset]);

  const handleClose = () => {
    reset(topicDefaultValues);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.topic.topic_details")}
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
      title={t("feature.topic.topic_details")}
      description={t("feature.topic.topic_details_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form className="space-y-6">
          <TopicForm form={form} mode={MODES.view} />
        </form>
      </Form>
    </ModalCustom>
  );
}
