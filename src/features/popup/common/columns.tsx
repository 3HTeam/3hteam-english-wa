import { ColumnDef } from "@tanstack/react-table";

import {
  DataTableColumnHeader,
  DataTableRowActions,
} from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DATE_FORMATS } from "@/constants/common";
import { TModule } from "@/types/features/module";
import { formatDate } from "@/utils/date";

import { PopupFormValues } from "../schemas";
import { COLUMN_KEYS } from "./constants";

interface CreateColumnsOptions {
  t: (key: string, options?: any) => string;
  modules?: TModule[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onForceDelete?: (id: string) => void;
  getId?: (data: PopupFormValues) => string;
}

export const createColumns = (
  options: CreateColumnsOptions,
): ColumnDef<PopupFormValues>[] => [
  {
    id: COLUMN_KEYS.id,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className="translate-y-[2px] cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: COLUMN_KEYS.title,
    meta: {
      name: options.t("column.popup.title"),
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.popup.title")}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.imageUrl,
    meta: {
      name: options.t("column.common.image"),
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.image")}
      />
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      return (
        <div className="flex items-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Popup"
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.moduleId,
    meta: {
      name: options.t("column.popup.module"),
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.popup.module")}
      />
    ),
    cell: ({ row }) => {
      const moduleId = row.getValue("moduleId") as string;
      const module = options.modules?.find((m) => m.id === moduleId);
      return (
        <div className="flex items-center">
          <span className="max-w-[200px] truncate font-medium">
            {module?.name || "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.status,
    meta: {
      name: options.t("column.common.status"),
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.status")}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div className="flex items-center">
          <Badge variant={status ? "success" : "error"}>
            {status
              ? options.t("common.status.active")
              : options.t("common.status.inactive")}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: COLUMN_KEYS.createdAt,
    meta: {
      name: options.t("column.common.created_at"),
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.created_at")}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="truncate font-medium">
            {formatDate(row.getValue("createdAt"), DATE_FORMATS.DD_MM_YYYY)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.updatedAt,
    meta: {
      name: options.t("column.common.updated_at"),
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.updated_at")}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="truncate font-medium">
            {formatDate(row.getValue("updatedAt"), DATE_FORMATS.DD_MM_YYYY)}
          </span>
        </div>
      );
    },
  },
  {
    id: COLUMN_KEYS.actions,
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onView={options?.onView}
        onEdit={options?.onEdit}
        onDelete={options?.onDelete}
        onRestore={options?.onRestore}
        onForceDelete={options?.onForceDelete}
        getId={options?.getId}
      />
    ),
  },
];
