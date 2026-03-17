import z from "zod";

import { EMPTY } from "@/constants/common";
import { TExerciseCategory, TExerciseType } from "@/types/features";

export const EXERCISE_CATEGORIES: TExerciseCategory[] = [
  "GRAMMAR",
  "VOCABULARY",
  "READING",
  "LISTENING",
] as const;

export const EXERCISE_TYPES: TExerciseType[] = [
  "MULTIPLE_CHOICE",
  "FILL_BLANK",
  "MATCHING",
  "TRUE_FALSE",
  "LISTENING",
  "ORDERING",
] as const;

export const getExerciseOptionSchema = (t: (key: string) => string) =>
  z.object({
    content: z.string().min(1, t("schema.exercise.content_required")),
    isCorrect: z.boolean(),
    order: z.number().optional(),
    matchWith: z.string().optional(),
  });

export const getExerciseSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) =>
  z.object({
    question: z.string().min(1, t("schema.exercise.question_required")),
    category: z.enum(
      EXERCISE_CATEGORIES as [TExerciseCategory, ...TExerciseCategory[]],
      {
        message: t("schema.exercise.category_required"),
      },
    ),
    type: z.enum(EXERCISE_TYPES as [TExerciseType, ...TExerciseType[]], {
      message: t("schema.exercise.type_required"),
    }),
    exerciseOptions: z
      .array(getExerciseOptionSchema(t))
      .min(1, t("schema.exercise.option_min", { min: 1 })),
    levelId: z.string().min(1, t("schema.exercise.level_required")),
    topicId: z.string().optional(),
    grammarTopicId: z.string().optional(),
    content: z.string().optional(),
    transcript: z.string().optional(),
    explanation: z.string().optional(),
    mediaUrl: z.string().optional(),
    mediaType: z.enum(["IMAGE", "VIDEO", "AUDIO"]).nullable().optional(),
    score: z.number().optional(),
    tags: z.array(z.string()).optional(),
    status: z.boolean().optional(),
  });

export type ExerciseOptionFormValues = z.infer<
  ReturnType<typeof getExerciseOptionSchema>
>;
export type ExerciseFormValues = z.infer<ReturnType<typeof getExerciseSchema>>;

export const exerciseOptionDefaultValues: ExerciseOptionFormValues = {
  content: EMPTY.str,
  isCorrect: false,
  order: EMPTY.num,
  matchWith: EMPTY.str,
};

export const exerciseDefaultValues: ExerciseFormValues = {
  question: EMPTY.str,
  category: EMPTY.str as any,
  type: EMPTY.str as any,
  exerciseOptions: [exerciseOptionDefaultValues],
  levelId: EMPTY.str,
  topicId: EMPTY.str,
  grammarTopicId: EMPTY.str,
  content: EMPTY.str,
  transcript: EMPTY.str,
  explanation: EMPTY.str,
  mediaUrl: EMPTY.str,
  mediaType: EMPTY.null,
  score: 0,
  tags: EMPTY.arr,
  status: true,
};
