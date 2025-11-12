import { api } from "@/api";

export interface RequestPasswordResetData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface PasswordResetResponse {
  message: string;
}

export const passwordResetService = {
  requestPasswordReset: async (
    data: RequestPasswordResetData
  ): Promise<PasswordResetResponse> => {
    return api.post("/users/request-password-reset", data);
  },

  resetPassword: async (
    data: ResetPasswordData
  ): Promise<PasswordResetResponse> => {
    return api.put("/users/reset-password", data);
  },
};
