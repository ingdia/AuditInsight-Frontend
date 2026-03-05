import { ReactNode } from "react";

export interface ModlProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}