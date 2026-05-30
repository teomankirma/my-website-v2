import {z} from 'zod';

export type ContactMessages = {
  name_required: string; name_min: string; name_max: string;
  email_required: string; email_invalid: string; email_max: string;
  message_required: string; message_min: string; message_max: string;
};

export function makeContactSchema(m: ContactMessages) {
  return z.object({
    name: z
      .string({error: m.name_required})
      .min(2, m.name_min)
      .max(100, m.name_max),
    email: z
      .string({error: m.email_required})
      .min(1, m.email_required)
      .email(m.email_invalid)
      .max(254, m.email_max),
    message: z
      .string({error: m.message_required})
      .min(10, m.message_min)
      .max(2000, m.message_max),
  });
}

export type ContactValues = z.infer<ReturnType<typeof makeContactSchema>>;
