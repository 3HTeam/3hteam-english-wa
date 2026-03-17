"use client";

import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useGetTopicByIdQuery, useUpdateTopicMutation } from "@/apis/hooks";
import { DialogError } from "@/components/shared/dialog";
import { ModalCustom } from "@/components/shared/modal-custom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";
import { generateSlug } from "@/utils/string";

import { topicDefaultValues } from "../../common";
import { getTopicSchema, type TopicFormValues } from "../../schemas";
import { TopicForm } from "../topic-form";

interface EditTopicModalProps {
  topicId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditTopicModal({
  topicId,
  open: controlledOpen,
  onOpenChange,
}: EditTopicModalProps) {
  const t = useTranslations();
  const {
    data: topicData,
    isLoading,
    isError,
  } = useGetTopicByIdQuery(topicId || EMPTY.str);
  const { mutate: updateTopic, isPending } = useUpdateTopicMutation();

  const topicSchema = useMemo(() => getTopicSchema(t), [t]);

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: topicDefaultValues,
  });

  const { handleSubmit, reset, setValue } = form;
  const [isNameManuallyChanged, setIsNameManuallyChanged] = useState(false);

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
      setIsNameManuallyChanged(false);
    }
  }, [topicData, controlledOpen, reset]);

  useEffect(() => {
    if (!controlledOpen) {
      reset(topicDefaultValues);
      setIsNameManuallyChanged(false);
    }
  }, [controlledOpen, reset]);

  const handleNameChange = (name: string) => {
    if (!isNameManuallyChanged && name) {
      const generatedSlug = generateSlug(name);
      setValue("slug", generatedSlug);
    }
  };

  const onSubmit: SubmitHandler<TopicFormValues> = (values) => {
    updateTopic(
      {
        id: topicId || EMPTY.str,
        payload: {
          name: values.name,
          slug: values.slug,
          description: values.description || EMPTY.str,
          imageUrl: values.imageUrl,
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
    reset(topicDefaultValues);
    setIsNameManuallyChanged(false);
    onOpenChange?.(false);
  };

  if (isError) {
    return (
      <DialogError
        open={controlledOpen}
        onOpenChange={onOpenChange}
        title={t("feature.topic.edit_topic")}
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
        form="edit-topic-form"
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
      title={t("feature.topic.edit_topic")}
      description={t("feature.topic.edit_topic_desc")}
      footer={footer}
      isLoading={isLoading}
    >
      <Form {...form}>
        <form
          id="edit-topic-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <TopicForm
            form={form}
            mode={MODES.edit}
            onNameChange={handleNameChange}
          />
        </form>
      </Form>
    </ModalCustom>
  );
}
