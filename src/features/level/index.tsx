"use client";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import {
  useDeleteLevelMutation,
  useForceDeleteLevelMutation,
  useGetLevelQuery,
  useRestoreLevelMutation,
} from "@/apis/hooks";
import { DataTable } from "@/components/shared/data-table";
import { DialogDelete } from "@/components/shared/dialog";
import { ToolbarActions } from "@/components/shared/toolbar-actions";
import { EMPTY } from "@/constants/common";
import { useTranslations } from "@/hooks";
import {
  TDeleteLevelResponse,
  TForceDeleteLevelResponse,
  TRestoreLevelResponse,
} from "@/types/features/level";
import { handleApiError } from "@/utils/api/handle-api-error";

import { COLUMN_KEYS, createColumns, getStatuses } from "./common";
import { AddLevelModal, EditLevelModal, ViewLevelModal } from "./components";

export function LevelView() {
  const t = useTranslations();
  const { mutate: deleteLevel, isPending: isDeleting } =
    useDeleteLevelMutation();
  const { mutate: restoreLevel, isPending: isRestoring } =
    useRestoreLevelMutation();
  const { mutate: forceDeleteLevel, isPending: isForceDeleting } =
    useForceDeleteLevelMutation();

  const statuses = useMemo(() => getStatuses(t), [t]);

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>(EMPTY.str);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [isTrashMode, setIsTrashMode] = useState<boolean>(false);
  const [viewModalState, setViewModalState] = useState<{
    open: boolean;
    levelId: string | null;
  }>({
    open: false,
    levelId: null,
  });
  const [editModalState, setEditModalState] = useState<{
    open: boolean;
    levelId: string | null;
  }>({
    open: false,
    levelId: null,
  });
  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    levelId: string | null;
    isForceDelete: boolean;
  }>({
    open: false,
    levelId: null,
    isForceDelete: false,
  });

  const { data: levels, isLoading } = useGetLevelQuery({
    page,
    search,
    status: statusFilter,
    isDeleted: isTrashMode,
  });

  const handleView = (id: string) => {
    setViewModalState({
      open: true,
      levelId: id,
    });
  };

  const handleEdit = (id: string) => {
    setEditModalState({
      open: true,
      levelId: id,
    });
  };

  const handleDelete = (id: string) => {
    setDeleteModalState({
      open: true,
      levelId: id,
      isForceDelete: false,
    });
  };

  const handleRestore = (id: string) => {
    restoreLevel(id, {
      onSuccess: (data: TRestoreLevelResponse) => {
        toast.success(data?.message || t("common.toast.restore_success"));
      },
      onError: (error: Error) =>
        handleApiError(error, t("common.toast.restore_error")),
    });
  };

  const handleForceDelete = (id: string) => {
    setDeleteModalState({
      open: true,
      levelId: id,
      isForceDelete: true,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteModalState.levelId) return;

    if (deleteModalState.isForceDelete) {
      forceDeleteLevel(deleteModalState.levelId, {
        onSuccess: (data: TForceDeleteLevelResponse) => {
          setDeleteModalState({
            open: false,
            levelId: null,
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
      deleteLevel(deleteModalState.levelId, {
        onSuccess: (data: TDeleteLevelResponse) => {
          setDeleteModalState({
            open: false,
            levelId: null,
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
    <>
      <ViewLevelModal
        levelId={viewModalState.levelId}
        open={viewModalState.open}
        onOpenChange={(open: boolean) =>
          setViewModalState((prev) => ({ ...prev, open }))
        }
      />
      <EditLevelModal
        levelId={editModalState.levelId}
        open={editModalState.open}
        onOpenChange={(open: boolean) =>
          setEditModalState((prev) => ({ ...prev, open }))
        }
      />
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
        data={levels?.data?.levels || []}
        columns={columns}
        addButton={
          <ToolbarActions
            isTrashMode={isTrashMode}
            onToggleTrashMode={handleToggleTrashMode}
            addButton={<AddLevelModal />}
          />
        }
        toolbarProps={{
          placeholder: isTrashMode
            ? t("common.trash.search_placeholder")
            : t("feature.level.search_placeholder"),
          searchColumn: COLUMN_KEYS.name,
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
          onSearchChange: (val) => {
            setPage(1);
            setSearch(val);
          },
          onFilterChange: (columnId, value) => {
            if (columnId === COLUMN_KEYS.status) {
              setPage(1);
              setStatusFilter(value);
            }
          },
        }}
        paginationProps={{
          page: levels?.data?.meta.page,
          pageCount: levels?.data?.meta.pageCount,
          limit: levels?.data?.meta.limit,
          total: levels?.data?.meta.total,
          onPageChange: (newPage) => setPage(newPage),
        }}
      />
    </>
  );
}
