"use client";

import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import {
  useDeleteExerciseMutation,
  useForceDeleteExerciseMutation,
  useGetExcerciseQuery,
  useRestoreExerciseMutation,
} from "@/apis/hooks/exercise";
import { DataTable } from "@/components/shared/data-table";
import { DialogDelete } from "@/components/shared/dialog";
import { ToolbarActions } from "@/components/shared/toolbar-actions";
import { Button } from "@/components/ui/button";
import { EMPTY, MODES } from "@/constants/common";
import { ROUTE_PATH } from "@/constants/routes";
import { useTranslations } from "@/hooks";
import { handleApiError } from "@/utils/api/handle-api-error";

import { createColumns, getStatuses } from "./common";

export default function ExerciseView() {
  const t = useTranslations();
  const router = useRouter();
  const statuses = useMemo(() => getStatuses(t), [t]);

  const { mutate: deleteExercise, isPending: isDeleting } =
    useDeleteExerciseMutation();
  const { mutate: restoreExercise, isPending: isRestoring } =
    useRestoreExerciseMutation();
  const { mutate: forceDeleteExercise, isPending: isForceDeleting } =
    useForceDeleteExerciseMutation();

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>(EMPTY.str);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [isTrashMode, setIsTrashMode] = useState<boolean>(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    exerciseId: string | null;
    isForceDelete: boolean;
  }>({
    open: false,
    exerciseId: null,
    isForceDelete: false,
  });

  const { data: exercises } = useGetExcerciseQuery({
    page,
    search,
    status: statusFilter,
    isDeleted: isTrashMode,
  });

  const handleView = (id: string) => {
    router.push(`${ROUTE_PATH.admin.exercises}/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`${ROUTE_PATH.admin.exercises}/${id}/${MODES.edit}`);
  };

  const handleDelete = (id: string) => {
    setDeleteModalState({
      open: true,
      exerciseId: id,
      isForceDelete: false,
    });
  };

  const handleRestore = (id: string) => {
    restoreExercise(id, {
      onSuccess: (data) => {
        toast.success(data?.message || t("common.toast.restore_success"));
      },
      onError: (error: Error) =>
        handleApiError(error, t("common.toast.restore_error")),
    });
  };

  const handleForceDelete = (id: string) => {
    setDeleteModalState({
      open: true,
      exerciseId: id,
      isForceDelete: true,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteModalState.exerciseId) return;

    if (deleteModalState.isForceDelete) {
      forceDeleteExercise(deleteModalState.exerciseId, {
        onSuccess: (data) => {
          setDeleteModalState({
            open: false,
            exerciseId: null,
            isForceDelete: false,
          });
          toast.success(
            data?.message || t("common.toast.force_delete_success"),
          );
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.force_delete_error")),
      });
    } else {
      deleteExercise(deleteModalState.exerciseId, {
        onSuccess: (data) => {
          setDeleteModalState({
            open: false,
            exerciseId: null,
            isForceDelete: false,
          });
          toast.success(data?.message || t("common.toast.delete_success"));
        },
        onError: (error: Error) =>
          handleApiError(error, t("common.toast.delete_error")),
      });
    }
  };

  const handleToggleTrashMode = () => {
    setIsTrashMode((prev) => !prev);
    setPage(1);
    setSearch(EMPTY.str);
    setStatusFilter(undefined);
  };

  const columns = isTrashMode
    ? createColumns({
        t,
        onView: handleView,
        onRestore: handleRestore,
        onForceDelete: handleForceDelete,
      })
    : createColumns({
        t,
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      });

  return (
    <React.Fragment>
      <DialogDelete
        open={deleteModalState.open}
        onOpenChange={(open) =>
          setDeleteModalState((prev) => ({ ...prev, open }))
        }
        title={
          deleteModalState.isForceDelete
            ? t("common.dialog.force_delete_title")
            : t("common.dialog.delete_title")
        }
        description={
          deleteModalState.isForceDelete
            ? t("common.dialog.force_delete_desc")
            : t("common.dialog.delete_desc")
        }
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting || isForceDeleting}
      />
      <DataTable
        columns={columns}
        data={exercises?.data?.exercises || []}
        addButton={
          <ToolbarActions
            isTrashMode={isTrashMode}
            onToggleTrashMode={handleToggleTrashMode}
            addButton={
              <Button
                className="cursor-pointer"
                onClick={() =>
                  router.push(`${ROUTE_PATH.admin.exercises}/${MODES.add}`)
                }
              >
                <PlusIcon />
                {t("feature.exercise.add_new_exercise")}
              </Button>
            }
          />
        }
        toolbarProps={{
          placeholder: isTrashMode
            ? t("common.trash.search_placeholder")
            : t("feature.exercise.search_placeholder"),
          searchColumn: "question",
          search,
          filters: isTrashMode
            ? []
            : [
                {
                  columnId: "status",
                  title: t("field.common.status"),
                  options: statuses,
                },
              ],
          onSearchChange: (value) => {
            setPage(1);
            setSearch(value);
          },
          onFilterChange: (columnId, value) => {
            if (columnId === "status") {
              setPage(1);
              setStatusFilter(value);
            }
          },
        }}
        paginationProps={{
          page: exercises?.data?.meta.page,
          pageCount: exercises?.data?.meta.pageCount,
          limit: exercises?.data?.meta.limit,
          total: exercises?.data?.meta.total,
          onPageChange: (newPage) => setPage(newPage),
        }}
      />
    </React.Fragment>
  );
}
