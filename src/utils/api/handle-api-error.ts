import { AxiosError } from "axios";
import { toast } from "sonner";

import { ApiResponse } from "@/types/api";

export const handleApiError = (error: Error, fallbackMessage?: string) => {
  const axiosError = error as AxiosError<ApiResponse>;
  const message = axiosError.response?.data?.message;
  toast.error(
    message || axiosError.message || fallbackMessage || "Đã có lỗi xảy ra!",
  );
};
