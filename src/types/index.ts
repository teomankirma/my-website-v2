export const Language = {
  TR: "tr",
  EN: "en",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

// Contact form values (reused by the Phase 3 contact form rewrite)
export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};
