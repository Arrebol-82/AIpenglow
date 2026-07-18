export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/admin") || to.path === "/admin/login") {
    return;
  }

  const { data, error } = await useFetch<{ authenticated: boolean }>(
    "/api/admin/auth/me",
    {
      headers: import.meta.server ? useRequestHeaders(["cookie"]) : undefined,
    },
  );

  if (error.value || !data.value?.authenticated) {
    return navigateTo("/admin/login");
  }
});
