import { createError, defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event);
  const bodyObject =
    typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};

  if (
    !isValidAdminCredentials(
      event,
      bodyObject.username,
      bodyObject.password,
    )
  ) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid admin credentials.",
    });
  }

  createAdminSession(event);

  return {
    ok: true,
  };
});
