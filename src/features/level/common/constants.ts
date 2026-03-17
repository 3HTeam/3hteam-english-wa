import { EMPTY } from "@/constants/common";

import { LevelFormValues } from "../schemas";

export const COLUMN_KEYS = {
  id: "id",
  cefrLevel: "cefrLevel",
  name: "name",
  toeicScoreMin: "toeicScoreMin",
  toeicScoreMax: "toeicScoreMax",
  ieltsMin: "ieltsMin",
  ieltsMax: "ieltsMax",
  order: "order",
  status: "status",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  actions: "actions",
};

export const levelDefaultValues: LevelFormValues = {
  cefrLevel: EMPTY.str,
  name: EMPTY.str,
  description: EMPTY.str,
  toeicScoreMin: 0,
  toeicScoreMax: 0,
  ieltsMin: 0,
  ieltsMax: 0,
  order: 0,
  status: true,
};
