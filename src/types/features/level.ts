import { ApiResponse, TMeta } from "../api";

export type TLevel = {
  id: string;
  cefrLevel: string;
  name: string;
  description: string;
  toeicScoreMin: number;
  toeicScoreMax: number;
  ieltsMin: number;
  ieltsMax: number;
  order: number;
  status: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TLevelPayload = Pick<
  TLevel,
  | "cefrLevel"
  | "name"
  | "description"
  | "toeicScoreMin"
  | "toeicScoreMax"
  | "ieltsMin"
  | "ieltsMax"
  | "order"
  | "status"
>;

export type TLevelsResponse = ApiResponse<{
  levels: TLevel[];
  meta: TMeta;
}>;

export type TLevelByIdResponse = ApiResponse<{
  level: TLevel;
}>;

export type TCreateLevelResponse = ApiResponse<{
  level: TLevel;
}>;

export type TUpdateLevelResponse = ApiResponse<TLevel>;

export type TDeleteLevelResponse = ApiResponse<void>;

export type TRestoreLevelResponse = ApiResponse<void>;

export type TForceDeleteLevelResponse = ApiResponse<void>;
