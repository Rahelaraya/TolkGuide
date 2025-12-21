import { apiFetch } from "./http";

export type ProfileDto = {
  username: string;
  role: "Customer" | "Interpreter";
  email?: string;
  phoneNumber?: string;
  city?: string;
  languages?: string[];
};

export function getMyProfile() {
  return apiFetch<ProfileDto>("/api/profile/me");
}
