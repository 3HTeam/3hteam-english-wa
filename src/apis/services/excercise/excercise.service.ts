import { axiosClient, EXERCISE_ENDPOINTS } from "@/apis/config";
import { TParams } from "@/types/api";
import {
  TCreateExerciseResponse,
  TExerciseByIdResponse,
  TExercisePayload,
  TExercisesResponse,
} from "@/types/features/exercise";

export async function getExcercise(
  params: TParams,
): Promise<TExercisesResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.status !== undefined) {
      queryParams.append("status", params.status);
    }
    if (params?.isDeleted !== undefined) {
      queryParams.append("isDeleted", params.isDeleted.toString());
    }
    const res = await axiosClient.get<TExercisesResponse>(
      `${EXERCISE_ENDPOINTS.base}?${queryParams.toString()}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getExerciseById(
  id: string,
): Promise<TExerciseByIdResponse> {
  try {
    const res = await axiosClient.get<TExerciseByIdResponse>(
      `${EXERCISE_ENDPOINTS.base}/${id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createExercise(payload: TExercisePayload) {
  try {
    const res = await axiosClient.post<TCreateExerciseResponse>(
      EXERCISE_ENDPOINTS.base,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateExercise(id: string, payload: TExercisePayload) {
  try {
    const res = await axiosClient.put<TExerciseByIdResponse>(
      `${EXERCISE_ENDPOINTS.base}/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteExercise(id: string) {
  try {
    const res = await axiosClient.delete<TExerciseByIdResponse>(
      `${EXERCISE_ENDPOINTS.base}/${id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function restoreExercise(id: string) {
  try {
    const res = await axiosClient.patch<TExerciseByIdResponse>(
      `${EXERCISE_ENDPOINTS.base}/${id}/restore`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function forceDeleteExercise(id: string) {
  try {
    const res = await axiosClient.delete<TExerciseByIdResponse>(
      `${EXERCISE_ENDPOINTS.base}/${id}/force`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
