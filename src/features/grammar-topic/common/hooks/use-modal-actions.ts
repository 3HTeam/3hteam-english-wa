import { useCallback } from "react";

import { toast } from "sonner";

import {
  useCreateGrammarTopicMutation,
  useDeleteGrammarTopicMutation,
  useForceDeleteGrammarTopicMutation,
  useRestoreGrammarTopicMutation,
  useUpdateGrammarTopicMutation,
} from "@/apis/hooks";
import { MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { FormValues } from "../../components/modal-view/schemas";
import { ModalMode } from "./use-modal";

interface UseModalActionsProps {
  mode: ModalMode;
  selectedId: string | null;
  onSuccess?: () => void;
}

export const useModalActions = ({
  mode,
  selectedId,
  onSuccess,
}: UseModalActionsProps) => {
  const t = useTranslations();

  const { mutate: createMutation, isPending: isCreating } =
    useCreateGrammarTopicMutation();
  const { mutate: updateMutation, isPending: isUpdating } =
    useUpdateGrammarTopicMutation();
  const { mutate: deleteMutation, isPending: isDeleting } =
    useDeleteGrammarTopicMutation();
  const { mutate: restoreMutation, isPending: isRestoring } =
    useRestoreGrammarTopicMutation();
  const { mutate: forceDeleteMutation, isPending: isForceDeleting } =
    useForceDeleteGrammarTopicMutation();

  const handleSubmit = useCallback(
    (data: FormValues) => {
      // Transform data to match API expectations
      const payload = {
        title: data.title,
        slug: data.slug,
        imageUrl: data.imageUrl,
        status: data.status,
        description: data.description || "", // Ensure description is never null/undefined
        content: data.content,
        difficulty: data.difficulty,
        order: data.order,
        levelId: data.levelId,
        grammarCategoryId: data.grammarCategoryId,
      };

      if (mode === MODES.add) {
        createMutation(payload, {
          onSuccess: () => {
            toast.success(
              t("common.toast.create_success", {
                item: "Chủ đề ngữ pháp",
              }),
            );
            onSuccess?.();
          },
          onError: (error: Error) =>
            handleApiError(error, t("common.toast.create_error")),
        });
      } else if (mode === MODES.edit && selectedId) {
        updateMutation(
          {
            id: selectedId,
            payload,
          },
          {
            onSuccess: () => {
              toast.success(
                t("common.toast.update_success", {
                  item: "Chủ đề ngữ pháp",
                }),
              );
              onSuccess?.();
            },
            onError: (error: Error) =>
              handleApiError(error, t("common.toast.update_error")),
          },
        );
      }
    },
    [mode, selectedId, createMutation, updateMutation, onSuccess, t],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation(id, {
        onSuccess: () => {
          toast.success(
            t("common.toast.delete_success", {
              item: "Chủ đề ngữ pháp",
            }),
          );
          onSuccess?.();
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.delete_error")),
      });
    },
    [deleteMutation, onSuccess, t],
  );

  const handleRestore = useCallback(
    (id: string) => {
      restoreMutation(id, {
        onSuccess: () => {
          toast.success(
            t("common.toast.restore_success", {
              item: "Chủ đề ngữ pháp",
            }),
          );
          onSuccess?.();
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.restore_error")),
      });
    },
    [restoreMutation, onSuccess, t],
  );

  const handleForceDelete = useCallback(
    (id: string) => {
      forceDeleteMutation(id, {
        onSuccess: () => {
          toast.success(
            t("common.toast.force_delete_success", {
              item: "Chủ đề ngữ pháp",
            }),
          );
          onSuccess?.();
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.force_delete_error")),
      });
    },
    [forceDeleteMutation, onSuccess, t],
  );

  const isLoading =
    isCreating || isUpdating || isDeleting || isRestoring || isForceDeleting;

  return {
    handleSubmit,
    handleDelete,
    handleRestore,
    handleForceDelete,
    isLoading,
  };
};
