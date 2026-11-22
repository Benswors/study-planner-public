import { z } from "zod";

export const authSchema = z.object({
  username: z.string().trim().min(1, "Вкажіть ім’я користувача."),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів."),
});

export type LoginInput = z.infer<typeof authSchema>;
