"use client";

import { useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BookOpen,
  Edit,
  FileText,
  Layers,
  Lightbulb,
  Loader2,
  Mic,
  Plus,
  Save,
  Settings2,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";

import {
  useGetGrammarTopicsQuery,
  useGetLevelQuery,
  useGetTopicQuery,
} from "@/apis/hooks";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY, MODES } from "@/constants/common";
import { ROUTE_PATH } from "@/constants/routes";
import { useTranslations } from "@/hooks";
import { TExercise } from "@/types/features";

import {
  EXERCISE_CATEGORIES,
  EXERCISE_TYPES,
  exerciseDefaultValues,
  exerciseOptionDefaultValues,
  getExerciseSchema,
  type ExerciseFormValues,
} from "../../schemas";

export type ExerciseFormMode =
  | typeof MODES.add
  | typeof MODES.edit
  | typeof MODES.view;

interface ExerciseFormProps {
  mode: ExerciseFormMode;
  initialData?: TExercise;
  onSubmit?: (values: ExerciseFormValues, reset: () => void) => void;
  isSubmitting?: boolean;
}

const MEDIA_TYPES = ["IMAGE", "VIDEO", "AUDIO"] as const;

function mapExerciseToFormValues(exercise: TExercise): ExerciseFormValues {
  return {
    question: exercise.question,
    category: exercise.category,
    type: exercise.type,
    exerciseOptions: exercise.exerciseOptions.map((opt) => ({
      content: opt.content,
      isCorrect: opt.isCorrect,
      order: opt.order,
      matchWith: opt.matchWith ?? undefined,
    })),
    levelId: exercise.levelId,
    topicId: exercise.topicId ?? "",
    grammarTopicId: exercise.grammarTopicId ?? "",
    content: exercise.content ?? "",
    transcript: exercise.transcript ?? "",
    explanation: exercise.explanation ?? "",
    mediaUrl: exercise.mediaUrl ?? "",
    mediaType: exercise.mediaType ?? null,
    score: exercise.score ?? 0,
    tags: exercise.tags ?? [],
    status: exercise.status ?? true,
  };
}

export function ExerciseForm({
  mode,
  initialData,
  onSubmit: externalOnSubmit,
  isSubmitting: externalIsSubmitting,
}: ExerciseFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const isReadOnly = mode === MODES.view;

  const { data: levels } = useGetLevelQuery();
  const { data: topics } = useGetTopicQuery();
  const { data: grammarTopics } = useGetGrammarTopicsQuery();

  const exerciseSchema = useMemo(() => getExerciseSchema(t), [t]);

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: initialData
      ? mapExerciseToFormValues(initialData)
      : exerciseDefaultValues,
  });

  const modeConfig: Record<
    ExerciseFormMode,
    { title: string; breadcrumb: string; submitLabel: string }
  > = {
    add: {
      title: t("feature.exercise.add_new_exercise"),
      breadcrumb: t("feature.exercise.add_new_exercise"),
      submitLabel: t("common.actions.save"),
    },
    view: {
      title: t("feature.exercise.exercise_details"),
      breadcrumb: t("feature.exercise.exercise_details"),
      submitLabel: EMPTY.str,
    },
    edit: {
      title: t("feature.exercise.edit_exercise"),
      breadcrumb: t("feature.exercise.edit_exercise"),
      submitLabel: t("common.actions.update"),
    },
  };

  const config = modeConfig[mode];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting: formIsSubmitting },
  } = form;

  const isSubmitting = externalIsSubmitting ?? formIsSubmitting;

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({ control, name: "exerciseOptions" });

  const tags = watch("tags") ?? [];
  const mediaType = watch("mediaType");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = (e.target as HTMLInputElement).value.trim();
      if (val && !tags.includes(val)) {
        setValue("tags", [...tags, val]);
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  };

  const handleFormSubmit: SubmitHandler<ExerciseFormValues> = (values) => {
    externalOnSubmit?.(values, () => form.reset(exerciseDefaultValues));
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => router.back()}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <BreadcrumbLink asChild>
                <Link href={ROUTE_PATH.admin.exercises}>
                  {t("feature.exercise.exercises")}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{config.breadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
          <div className="flex gap-2">
            {mode === MODES.view ? (
              <Button
                type="button"
                onClick={() =>
                  router.push(
                    `${ROUTE_PATH.admin.exercises}/${initialData?.id}/edit`,
                  )
                }
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t("common.actions.edit")}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ROUTE_PATH.admin.exercises)}
                  className="cursor-pointer"
                >
                  {t("common.actions.cancel")}
                </Button>
                <Button
                  onClick={handleSubmit(handleFormSubmit)}
                  disabled={isSubmitting}
                  className="cursor-pointer min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("common.actions.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {config.submitLabel}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {t("feature.exercise.sections.question")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("field.exercise.question")}{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              "field.exercise.question_placeholder",
                            )}
                            disabled={isReadOnly}
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("field.exercise.content")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              "field.exercise.content_placeholder",
                            )}
                            disabled={isReadOnly}
                            rows={2}
                            {...field}
                            value={field.value ?? EMPTY.str}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Đáp án */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Layers className="h-4 w-4 text-primary" />
                      {t("feature.exercise.sections.options")}
                    </CardTitle>
                    {!isReadOnly && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          appendOption(exerciseOptionDefaultValues)
                        }
                        className="cursor-pointer h-8 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        {t("feature.exercise.option.add")}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {optionFields.map((optField, index) => (
                    <div
                      key={optField.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background border text-[11px] font-semibold text-muted-foreground shrink-0">
                        {index + 1}
                      </span>

                      <FormField
                        control={control}
                        name={`exerciseOptions.${index}.content`}
                        render={({ field }) => (
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <Input
                                placeholder={t(
                                  "field.exercise.option_content_placeholder",
                                )}
                                disabled={isReadOnly}
                                className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-8"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`exerciseOptions.${index}.isCorrect`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-1.5 space-y-0 shrink-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isReadOnly}
                                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 text-xs font-normal text-muted-foreground cursor-pointer">
                              {t("field.exercise.is_correct")}
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      {!isReadOnly && optionFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Media & Transcript */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mic className="h-4 w-4 text-primary" />
                    {t("feature.exercise.sections.media")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="mediaType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("field.exercise.media_type")}
                          </FormLabel>
                          <Select
                            onValueChange={(val) =>
                              field.onChange(val === "none" ? null : val)
                            }
                            value={field.value ?? "none"}
                            disabled={isReadOnly}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "field.exercise.select_media_type",
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                {t("field.exercise.select_media_type_optional")}
                              </SelectItem>
                              {MEDIA_TYPES.map((mt) => (
                                <SelectItem key={mt} value={mt}>
                                  {t(
                                    `feature.exercise.media_type.${mt.toLowerCase()}`,
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="mediaUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("field.exercise.media_url")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://..."
                              disabled={isReadOnly || !mediaType}
                              {...field}
                              value={field.value ?? EMPTY.str}
                            />
                          </FormControl>
                          {!mediaType && (
                            <p className="text-[11px] text-muted-foreground">
                              {t("field.exercise.media_url_hint")}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="transcript"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("field.exercise.transcript")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              "field.exercise.transcript_placeholder",
                            )}
                            disabled={isReadOnly}
                            rows={3}
                            {...field}
                            value={field.value ?? EMPTY.str}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Giải thích */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    {t("feature.exercise.sections.explanation")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="explanation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              "field.exercise.explanation_placeholder",
                            )}
                            disabled={isReadOnly}
                            rows={4}
                            {...field}
                            value={field.value ?? EMPTY.str}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings2 className="h-4 w-4 text-primary" />
                    {t("feature.exercise.sections.classification")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("field.exercise.exercise_type")}{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isReadOnly}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("field.exercise.select_type")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXERCISE_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {t(
                                  `feature.exercise.type.${type.toLowerCase()}`,
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("field.exercise.category")}{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isReadOnly}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "field.exercise.select_category",
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXERCISE_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {t(
                                  `feature.exercise.category.${category.toLowerCase()}`,
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={control}
                    name="levelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("field.level.level")}{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isReadOnly}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("field.level.level_placeholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {levels?.data?.levels?.map((level) => (
                              <SelectItem key={level.id} value={level.id}>
                                {level.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="topicId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("field.topic.topic")}</FormLabel>
                        <Select
                          onValueChange={(val) =>
                            field.onChange(val === "none" ? "" : val)
                          }
                          value={field.value || "none"}
                          disabled={isReadOnly}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("field.topic.topic_placeholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              {t("field.topic.topic_placeholder")}
                            </SelectItem>
                            {topics?.data?.topics?.map((topic) => (
                              <SelectItem key={topic.id} value={topic.id}>
                                {topic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="grammarTopicId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("field.grammar_topic.grammar_topic")}
                        </FormLabel>
                        <Select
                          onValueChange={(val) =>
                            field.onChange(val === "none" ? "" : val)
                          }
                          value={field.value || "none"}
                          disabled={isReadOnly}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "field.grammar_topic.grammar_topic_placeholder",
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              {t(
                                "field.grammar_topic.grammar_topic_placeholder",
                              )}
                            </SelectItem>
                            {grammarTopics?.data?.grammarTopics?.map(
                              (grammarTopic) => (
                                <SelectItem
                                  key={grammarTopic.id}
                                  value={grammarTopic.id}
                                >
                                  {grammarTopic.title}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Điểm & Trạng thái */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-primary" />
                    {t("feature.exercise.sections.settings")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("field.exercise.score")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            disabled={isReadOnly}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            value={field.value ?? 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">
                            {t("field.common.status")}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {field.value
                              ? t("common.status.active")
                              : t("common.status.inactive")}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value ?? true}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Tag className="h-4 w-4 text-primary" />
                    {t("feature.exercise.sections.tags")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!isReadOnly && (
                    <Input
                      placeholder={t("field.exercise.tags_placeholder")}
                      onKeyDown={handleAddTag}
                    />
                  )}
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 text-xs"
                        >
                          {tag}
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-0.5 hover:text-destructive transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {t("field.exercise.tags_empty")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
