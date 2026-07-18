import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  clearAdminSession(event);

  return {
    ok: true,
  };
});
