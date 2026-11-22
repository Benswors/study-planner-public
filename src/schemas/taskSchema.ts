import { z } from "zod";
import { PRIORITIES } from "../types/task";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Вкажіть назву завдання.")
    .max(120, "До 120 символів."),
  description: z.string().trim().max(500, "До 500 символів."),
  category: z.string().trim().max(40, "До 40 символів."),
  priority: z.enum(PRIORITIES.map((option) => option.value)),
});

export type TaskFormData = z.infer<typeof taskSchema>;
