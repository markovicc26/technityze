/** Shared with contact form UI and `/api/contact` validation. */
export const CONTACT_PROJECT_TYPES = [
  "Website",
  "Web application",
  "Mobile application",
  "SEO and content",
  "Internal system / automation",
] as const;

export type ContactProjectType = (typeof CONTACT_PROJECT_TYPES)[number];
