import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTableColumnHeader,
  DataTableRowActions,
} from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { type TExercise } from "@/types/features/exercise";

import { CATEGORY_VARIANT, COLUMN_KEYS, TYPE_VARIANT } from ".";

interface CreateColumnsOptions {
  t: (key: string, options?: any) => string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onForceDelete?: (id: string) => void;
  getId?: (data: TExercise) => string;
}

export const createColumns = (
  options: CreateColumnsOptions,
): ColumnDef<TExercise>[] => [
  {
    id: COLUMN_KEYS.id,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
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
    accessorKey: COLUMN_KEYS.question,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.exercise.question")}
      />
    ),
    meta: {
      name: options.t("column.exercise.question"),
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue(COLUMN_KEYS.question)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.category,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.exercise.category")}
      />
    ),
    meta: {
      name: options.t("column.exercise.category"),
    },
    cell: ({ row }) => {
      const category = row.getValue(COLUMN_KEYS.category) as string;
      return (
        <Badge variant={(CATEGORY_VARIANT[category] as any) || "secondary"}>
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.type,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.exercise.type")}
      />
    ),
    meta: {
      name: options.t("column.exercise.type"),
    },
    cell: ({ row }) => {
      const type = row.getValue(COLUMN_KEYS.type) as string;
      return (
        <Badge variant={(TYPE_VARIANT[type] as any) || "secondary"}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: COLUMN_KEYS.score,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.exercise.score")}
      />
    ),
    meta: {
      name: options.t("column.exercise.score"),
    },
    cell: ({ row }) => {
      const score = row.getValue(COLUMN_KEYS.score) as number;
      return (
        <div className="flex items-center">
          <Badge variant="outline">{score}</Badge>
        </div>
      );
    },
  },
  {
    id: COLUMN_KEYS.tags,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.exercise.tags")}
      />
    ),
    meta: {
      name: options.t("column.exercise.tags"),
    },
    cell: ({ row }) => {
      const tags = (row.original as TExercise).tags || [];

      if (tags.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <div className="flex flex-wrap items-center gap-1 max-w-[200px]">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: COLUMN_KEYS.options,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={options.t("column.exercise.options")}
      />
    ),
    meta: {
      name: options.t("column.exercise.options"),
    },
    cell: ({ row }) => {
      const exerciseOptions = (row.original as TExercise).exerciseOptions || [];
      return <Badge variant="outline">{exerciseOptions.length}</Badge>;
    },
    enableSorting: false,
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
      const status = row.getValue(COLUMN_KEYS.status) as boolean;

      return (
        <Badge variant={status ? "emerald" : "secondary"}>
          {status
            ? options.t("common.status.active")
            : options.t("common.status.inactive")}
        </Badge>
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
