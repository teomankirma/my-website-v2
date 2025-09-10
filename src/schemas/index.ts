import { z } from "zod";
import type { ContactFormValues, Language } from "@/types";
import { translations } from "@/i18n";

export const makeContactFormSchema = (locale: Language) => {
  const m = translations[locale].contactValidation;
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, m.name_required)
      .min(2, m.name_min)
      .max(100, m.name_max),
    email: z
      .string()
      .trim()
      .min(1, m.email_required)
      .email(m.email_invalid)
      .max(254, m.email_max),
    message: z
      .string()
      .trim()
      .min(1, m.message_required)
      .min(10, m.message_min)
      .max(2000, m.message_max),
  });
};

export type ContactFormSchemaValues = z.infer<
  ReturnType<typeof makeContactFormSchema>
>;

export const contactDefaultValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
};
