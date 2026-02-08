import { z } from "zod";

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
  }),

  params: z.object({
    projectId: z.string().min(1, "Project ID required"),
  }),
});

export type InviteMemberBody =
  z.infer<typeof inviteMemberSchema>["body"];
