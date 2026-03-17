"use client";

import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { useCreateTopicMutation } from "@/apis/hooks";
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

interface AddTopicModalProps {
  trigger?: React.ReactNode;
}

export function AddTopicModal({ trigger }: AddTopicModalProps) {
  const t = useTranslations();
  const { mutate: createTopic, isPending } = useCreateTopicMutation();
  const [open, setOpen] = useState(false);

  const topicSchema = useMemo(() => getTopicSchema(t), [t]);

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: topicDefaultValues,
  });

  const { handleSubmit, reset, setValue } = form;

  const handleNameChange = (name: string) => {
    setValue("slug", generateSlug(name), { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<TopicFormValues> = (values) => {
    createTopic(
      {
        name: values.name,
        imageUrl: values.imageUrl,
        slug: values.slug,
        description: values.description || EMPTY.str,
        status: values.status,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || t("common.toast.create_success"));
          reset(topicDefaultValues);
          setOpen(false);
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.create_error")),
      },
    );
  };

  const handleCancel = () => {
    reset(topicDefaultValues);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="default" size="sm" className="cursor-pointer">
      <Plus className="w-4 h-4" />
      <span className="hidden lg:inline">
        {t("feature.topic.add_new_topic")}
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
        form="add-topic-form"
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
      title={t("feature.topic.add_new_topic")}
      description={t("feature.topic.add_new_topic_desc")}
      trigger={trigger || defaultTrigger}
      footer={footer}
    >
      <Form {...form}>
        <form
          id="add-topic-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <TopicForm
            form={form}
            mode={MODES.add}
            onNameChange={handleNameChange}
          />
        </form>
      </Form>
    </ModalCustom>
  );
}
