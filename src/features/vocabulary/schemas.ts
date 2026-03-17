import z from "zod";

import { EMPTY } from "@/constants/common";

const getDefinitionSchema = (t: (key: string) => string) =>
  z.object({
    definition: z.string().min(1, t("schema.vocabulary.definition_required")),
    translation: z.string().optional(),
    example: z.string().nullable().optional(),
    exampleTranslation: z.string().nullable().optional(),
  });

const getMeaningSchema = (
  t: (key: string, params?: Record<string, any>) => string,
) =>
  z.object({
    partOfSpeech: z
      .string()
      .min(1, t("schema.vocabulary.part_of_speech_required")),
    synonyms: z.array(z.string()).optional(),
    antonyms: z.array(z.string()).optional(),
    definitions: z
      .array(getDefinitionSchema(t))
      .min(1, t("schema.vocabulary.definition_min", { min: 1 })),
  });

export const getVocabularySchema = (
  t: (key: string, params?: Record<string, any>) => string,
) =>
  z.object({
    word: z.string().min(1, t("schema.vocabulary.word_required")),
    translation: z.string().min(1, t("schema.vocabulary.translation_required")),
    phonetic: z.string().min(1, t("schema.vocabulary.phonetic_required")),
    status: z.boolean(),
    audioUrlUs: z
      .string()
      .url(t("schema.vocabulary.audio_invalid"))
      .optional()
      .or(z.literal(EMPTY.str)),
    audioUrlUk: z
      .string()
      .url(t("schema.vocabulary.audio_invalid"))
      .optional()
      .or(z.literal(EMPTY.str)),
    audioUrlAu: z
      .string()
      .url(t("schema.vocabulary.audio_invalid"))
      .optional()
      .or(z.literal(EMPTY.str)),
    imageUrl: z
      .string()
      .url(t("schema.common.image_invalid"))
      .optional()
      .or(z.literal(EMPTY.str)),
    topicId: z.string().min(1, t("schema.vocabulary.topic_required")),
    meanings: z
      .array(getMeaningSchema(t))
      .min(1, t("schema.vocabulary.meaning_min", { min: 1 })),
  });

export type DefinitionFormValues = z.infer<
  ReturnType<typeof getDefinitionSchema>
>;
export type MeaningFormValues = z.infer<ReturnType<typeof getMeaningSchema>>;
export type VocabularyFormValues = z.infer<
  ReturnType<typeof getVocabularySchema>
>;

export const definitionDefaultValues: DefinitionFormValues = {
  definition: EMPTY.str,
  translation: EMPTY.str,
  example: EMPTY.str,
  exampleTranslation: EMPTY.str,
};

export const meaningDefaultValues: MeaningFormValues = {
  partOfSpeech: EMPTY.str,
  synonyms: EMPTY.arr,
  antonyms: EMPTY.arr,
  definitions: [definitionDefaultValues],
};

export const vocabularyDefaultValues: VocabularyFormValues = {
  word: EMPTY.str,
  translation: EMPTY.str,
  phonetic: EMPTY.str,
  status: true,
  audioUrlUs: EMPTY.str,
  audioUrlUk: EMPTY.str,
  audioUrlAu: EMPTY.str,
  imageUrl: EMPTY.str,
  topicId: EMPTY.str,
  meanings: [meaningDefaultValues],
};
