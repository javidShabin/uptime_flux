import { z } from "zod";

export const profileSchema = z.object({});

export type ProfileInput = z.infer<typeof profileSchema>;

