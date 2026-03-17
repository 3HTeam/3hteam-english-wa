import Image from "next/image";

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

interface CreateColumnsOptions {
  t: (key: string, options?: any) => string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onForceDelete?: (id: string) => void;
}

export const createColumns = ({
  t,
  onView,
  onEdit,
  onDelete,
  onRestore,
  onForceDelete,
}: CreateColumnsOptions): ColumnDef<any>[] => [
  {
    id: COLUMN_KEYS.id,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className="cursor-pointer mr-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="cursor-pointer mr-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: COLUMN_KEYS.name,
    meta: { name: t("column.grammar_category.name") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("column.grammar_category.name")}
      />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: COLUMN_KEYS.status,
    meta: { name: t("column.common.status") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("column.common.status")}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status ? "success" : "error"}>
          {status ? t("common.status.active") : t("common.status.inactive")}
        </Badge>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.imageUrl,
    meta: { name: t("column.common.image") },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("column.common.image")} />
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue(COLUMN_KEYS.imageUrl) as string;
      return (
        <Image
          src={imageUrl || "/placeholder.png"}
          alt="Image"
          width={50}
          height={50}
          className="w-[50px] h-[50px] object-contain"
        />
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.slug,
    meta: { name: t("column.grammar_category.slug") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("column.grammar_category.slug")}
      />
    ),
    cell: ({ row }) => <Badge variant="outline">{row.getValue("slug")}</Badge>,
  },
  {
    accessorKey: COLUMN_KEYS.description,
    meta: { name: t("column.common.description") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("column.common.description")}
      />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: COLUMN_KEYS.createdAt,
    meta: { name: t("column.common.created_at") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("column.common.created_at")}
      />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {formatDate(row.getValue("createdAt"), DATE_FORMATS.DD_MM_YYYY)}
      </span>
    ),
  },
  {
    accessorKey: COLUMN_KEYS.updatedAt,
    meta: { name: t("column.common.updated_at") },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("column.common.updated_at")}
      />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {formatDate(row.getValue("updatedAt"), DATE_FORMATS.DD_MM_YYYY)}
      </span>
    ),
  },
  {
    id: COLUMN_KEYS.actions,
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onRestore={onRestore}
        onForceDelete={onForceDelete}
      />
    ),
  },
];
