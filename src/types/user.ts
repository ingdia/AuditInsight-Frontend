export type UserRole = "CLIENT" | "AUDITOR" | "ADMIN" | "MEMBER";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  organisationId?: string;
  mustChangePassword?: boolean;
}

export interface Profile {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone?: string;
  certificationNumber?: string;
  address?: string;
}
