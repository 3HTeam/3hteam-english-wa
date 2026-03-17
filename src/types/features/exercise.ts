import { ApiResponse, TMeta } from "../api";

export type TExerciseCategory =
  | "GRAMMAR"
  | "VOCABULARY"
  | "READING"
  | "LISTENING";

export type TExerciseType =
  | "MULTIPLE_CHOICE"
  | "FILL_BLANK"
  | "MATCHING"
  | "TRUE_FALSE"
  | "LISTENING"
  | "ORDERING";

export type TExerciseOption = {
  id: string;
  content: string;
  isCorrect: boolean;
  order: number;
  matchWith: string | null;
  exerciseId: string;
};

export type TExerciseOptionPayload = {
  content: string;
  isCorrect: boolean;
  order?: number;
  matchWith?: string;
};

export type TMediaType = "IMAGE" | "VIDEO" | "AUDIO";

export type TExercise = {
  id: string;
  type: TExerciseType;
  category: TExerciseCategory;
  question: string;
  explanation: string;
  transcript: string | null;
  content: string;
  mediaUrl: string | null;
  mediaType: TMediaType | null;
  score: number;
  tags: string[];
  status: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  grammarTopicId: string | null;
  topicId: string | null;
  exerciseOptions: TExerciseOption[];
};

export type TExercisePayload = {
  type: TExerciseType;
  category: TExerciseCategory;
  question: string;
  explanation?: string;
  transcript?: string | null;
  content?: string;
  mediaUrl?: string | null;
  mediaType?: TMediaType | null;
  score?: number;
  tags?: string[];
  status?: boolean;
  levelId: string;
  grammarTopicId?: string | null;
  topicId?: string | null;
  exerciseOptions: TExerciseOptionPayload[];
};

export type TExercisesResponse = ApiResponse<{
  exercises: TExercise[];
  meta: TMeta;
}>;

export type TExerciseByIdResponse = ApiResponse<{
  exercise: TExercise;
}>;

export type TCreateExerciseResponse = ApiResponse<{
  exercise: TExercise;
}>;

export type TUpdateExerciseResponse = ApiResponse<TExercise>;

export type TDeleteExerciseResponse = ApiResponse<void>;

export type TRestoreExerciseResponse = ApiResponse<void>;

export type TForceDeleteExerciseResponse = ApiResponse<void>;
