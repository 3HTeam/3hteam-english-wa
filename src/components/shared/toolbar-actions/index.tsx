"use client";

import { ArrowLeft, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks";

interface ToolbarActionsProps {
  isTrashMode: boolean;
  onToggleTrashMode: () => void;
  addButton?: React.ReactNode;
}

export function ToolbarActions({
  isTrashMode,
  onToggleTrashMode,
  addButton,
}: ToolbarActionsProps) {
  const t = useTranslations();

  if (isTrashMode) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleTrashMode}
        className="cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t("common.actions.back")}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={onToggleTrashMode}
        className="cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden lg:inline ml-1">{t("common.trash.trash")}</span>
      </Button>
      {addButton}
    </div>
  );
}
