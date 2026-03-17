import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiServices } from "@/apis/services";
import { TParams } from "@/types/api";
import { TExercisePayload } from "@/types/features";

import { EXERCISE_QUERY_KEY } from "./constants";

export const useGetExcerciseQuery = (params: TParams) => {
  return useQuery({
    queryKey: [EXERCISE_QUERY_KEY.getExcercise, params],
    queryFn: () => apiServices.exercise.getExcercise(params),
  });
};

export const useGetExerciseByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [EXERCISE_QUERY_KEY.getExerciseById, id],
    queryFn: () => apiServices.exercise.getExerciseById(id),
  });
};

export const useCreateExerciseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TExercisePayload) =>
      apiServices.exercise.createExercise(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXERCISE_QUERY_KEY.getExcercise],
      });
    },
  });
};

export const useUpdateExerciseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TExercisePayload }) =>
      apiServices.exercise.updateExercise(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXERCISE_QUERY_KEY.getExcercise],
      });
    },
  });
};

export const useDeleteExerciseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiServices.exercise.deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXERCISE_QUERY_KEY.getExcercise],
      });
    },
  });
};

export const useRestoreExerciseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiServices.exercise.restoreExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXERCISE_QUERY_KEY.getExcercise],
      });
    },
  });
};

export const useForceDeleteExerciseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiServices.exercise.forceDeleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EXERCISE_QUERY_KEY.getExcercise],
      });
    },
  });
};
