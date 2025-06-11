import { ReactNode } from "react";

export type AppPageMetaProps = {
    children?: ReactNode;
    title?: string;
    description?: string;
    image?: string;
    contentType?: string;
}
interface Field {
  label: string
  name: string
  type?: string
  defaultValue?: string
}
export interface ReusableDialogFormProps {
  triggerText?: string;
  trigger?: ReactNode;
  title: string;
  description: string;
  fields: Field[];
  onSubmit: (formData: Record<string, string>) => void
}