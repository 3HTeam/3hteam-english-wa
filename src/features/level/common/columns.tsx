import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTableColumnHeader,
  DataTableRowActions,
} from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DATE_FORMATS } from "@/constants/common";
import { formatDate } from "@/utils/date";

import { COLUMN_KEYS } from ".";
import { type LevelFormValues } from "../schemas";

interface CreateColumnsOptions {
  t: (key: string, options?: any) => string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onForceDelete?: (id: string) => void;
  getId?: (data: LevelFormValues) => string;
}

export const createColumns = (
  options: CreateColumnsOptions,
): ColumnDef<LevelFormValues>[] => [
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
    accessorKey: COLUMN_KEYS.cefrLevel,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.level.cefr_level")}
      />
    ),
    meta: {
      name: options.t("column.level.cefr_level"),
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.getValue("cefrLevel")}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: COLUMN_KEYS.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.level.name")}
      />
    ),
    meta: {
      name: options.t("column.level.name"),
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.status,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.status")}
      />
    ),
    meta: {
      name: options.t("column.common.status"),
    },
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
    accessorKey: COLUMN_KEYS.order,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.order")}
      />
    ),
    meta: {
      name: options.t("column.common.order"),
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="font-medium">{row.getValue("order")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.description,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.description")}
      />
    ),
    meta: {
      name: options.t("column.common.description"),
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: COLUMN_KEYS.createdAt,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.created_at")}
      />
    ),
    meta: {
      name: options.t("column.common.created_at"),
    },
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
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.common.updated_at")}
      />
    ),
    meta: {
      name: options.t("column.common.updated_at"),
    },
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
