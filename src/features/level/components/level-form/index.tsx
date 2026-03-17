"use client";

import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY, MODES } from "@/constants/common";
import { useTranslations } from "@/hooks";

import { type LevelFormValues } from "../../schemas";

export type LevelFormMode =
  | typeof MODES.add
  | typeof MODES.view
  | typeof MODES.edit;

interface LevelFormProps {
  form: UseFormReturn<LevelFormValues>;
  mode: LevelFormMode;
}

export function LevelForm({ form, mode }: LevelFormProps) {
  const t = useTranslations();
  const isReadonly = mode === MODES.view;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("field.level.level_name")} {t("common.form.required")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("field.level.level_name_placeholder")}
                  {...field}
                  disabled={isReadonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cefrLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("field.level.cefr_level")} {t("common.form.required")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("field.level.cefr_level_placeholder")}
                  {...field}
                  disabled={isReadonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("field.common.order")} {t("common.form.required")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("field.common.order_placeholder")}
                  {...field}
                  disabled={isReadonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-x-2 mt-6 border p-2 rounded-lg">
              <div className="space-y-0.5">
                <FormLabel>{t("field.common.status")}</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadonly}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ieltsMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("field.level.ielts_min")} {t("common.form.required")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("field.level.ielts_min_placeholder")}
                  {...field}
                  disabled={isReadonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ieltsMax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("field.level.ielts_max")} {t("common.form.required")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("field.level.ielts_max_placeholder")}
                  {...field}
                  disabled={isReadonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="toeicScoreMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("field.level.toeic_min")} {t("common.form.required")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("field.level.toeic_min_placeholder")}
                  {...field}
                  disabled={isReadonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toeicScoreMax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("field.level.toeic_max")} {t("common.form.required")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("field.level.toeic_max_placeholder")}
                  {...field}
                  disabled={isReadonly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("field.common.description")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("field.common.description_placeholder")}
                rows={3}
                value={field.value ?? EMPTY.str}
                onChange={field.onChange}
                disabled={isReadonly}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
