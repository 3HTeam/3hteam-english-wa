"use client";

import React, { useMemo, useState } from "react";

import { toast } from "sonner";

import {
  useDeleteModuleMutation,
  useForceDeleteModuleMutation,
  useGetModuleQuery,
  useRestoreModuleMutation,
} from "@/apis/hooks";
import { DataTable } from "@/components/shared/data-table";
import { DialogDelete } from "@/components/shared/dialog";
import { ToolbarActions } from "@/components/shared/toolbar-actions";
import { EMPTY } from "@/constants/common";
import { useTranslations } from "@/hooks";
import {
  TDeleteModuleResponse,
  TForceDeleteModuleResponse,
  TRestoreModuleResponse,
} from "@/types/features";
import { handleApiError } from "@/utils/api/handle-api-error";

import { COLUMN_KEYS, createColumns, getStatuses } from "./common";
import { AddModuleModal, EditModuleModal, ViewModuleModal } from "./components";

export function ModuleView() {
  const t = useTranslations();
  const { mutate: deleteModule, isPending: isDeleting } =
    useDeleteModuleMutation();
  const { mutate: restoreModule, isPending: isRestoring } =
    useRestoreModuleMutation();
  const { mutate: forceDeleteModule, isPending: isForceDeleting } =
    useForceDeleteModuleMutation();

  const statuses = useMemo(() => getStatuses(t), [t]);

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>(EMPTY.str);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [isTrashMode, setIsTrashMode] = useState<boolean>(false);
  const [viewModalState, setViewModalState] = useState<{
    open: boolean;
    moduleId: string | null;
  }>({
    open: false,
    moduleId: null,
  });
  const [editModalState, setEditModalState] = useState<{
    open: boolean;
    moduleId: string | null;
  }>({
    open: false,
    moduleId: null,
  });
  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    moduleId: string | null;
    isForceDelete: boolean;
  }>({
    open: false,
    moduleId: null,
    isForceDelete: false,
  });

  const { data: modules } = useGetModuleQuery({
    page,
    search,
    status: statusFilter,
    isDeleted: isTrashMode,
  });

  const handleView = (id: string) => {
    setViewModalState({
      open: true,
      moduleId: id,
    });
  };

  const handleEdit = (id: string) => {
    setEditModalState({
      open: true,
      moduleId: id,
    });
  };

  const handleDelete = (id: string) => {
    setDeleteModalState({
      open: true,
      moduleId: id,
      isForceDelete: false,
    });
  };

  const handleRestore = (id: string) => {
    restoreModule(id, {
      onSuccess: (data: TRestoreModuleResponse) => {
        toast.success(data?.message || t("common.toast.restore_success"));
      },
      onError: (error: Error) =>
        handleApiError(error, t("common.toast.restore_error")),
    });
  };

  const handleForceDelete = (id: string) => {
    setDeleteModalState({
      open: true,
      moduleId: id,
      isForceDelete: true,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteModalState.moduleId) return;

    if (deleteModalState.isForceDelete) {
      forceDeleteModule(deleteModalState.moduleId, {
        onSuccess: (data: TForceDeleteModuleResponse) => {
          setDeleteModalState({
            open: false,
            moduleId: null,
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
      deleteModule(deleteModalState.moduleId, {
        onSuccess: (data: TDeleteModuleResponse) => {
          setDeleteModalState({
            open: false,
            moduleId: null,
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
      <ViewModuleModal
        moduleId={viewModalState.moduleId}
        open={viewModalState.open}
        onOpenChange={(open: boolean) =>
          setViewModalState((prev) => ({ ...prev, open }))
        }
      />
      <EditModuleModal
        moduleId={editModalState.moduleId}
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
        data={modules?.data?.modules || []}
        columns={columns}
        addButton={
          <ToolbarActions
            isTrashMode={isTrashMode}
            onToggleTrashMode={handleToggleTrashMode}
            addButton={<AddModuleModal />}
          />
        }
        toolbarProps={{
          placeholder: isTrashMode
            ? t("common.trash.search_placeholder")
            : t("feature.module.search_placeholder"),
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
          page: modules?.data?.meta.page,
          pageCount: modules?.data?.meta.pageCount,
          limit: modules?.data?.meta.limit,
          total: modules?.data?.meta.total,
          onPageChange: (newPage) => setPage(newPage),
        }}
      />
    </React.Fragment>
  );
}

export default ModuleView;
