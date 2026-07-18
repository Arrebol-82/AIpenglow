import { createHmac, timingSafeEqual } from "node:crypto";
import {
  createError,
  deleteCookie,
  getCookie,
  setCookie,
  type H3Event,
} from "h3";

const ADMIN_COOKIE_NAME = "alpenglow_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const DEFAULT_ADMIN_USERNAME = "Arrebol82";
const DEFAULT_ADMIN_PASSWORD = "zhu0802";

const getAdminConfig = (event: H3Event) => {
  const config = useRuntimeConfig(event);

  return {
    username: config.adminUsername || DEFAULT_ADMIN_USERNAME,
    password: config.adminPassword || DEFAULT_ADMIN_PASSWORD,
    secret:
      config.adminSessionSecret ||
      config.supabaseSecretKey ||
      config.adminPassword ||
      DEFAULT_ADMIN_PASSWORD,
  };
};

const signSession = (issuedAt: string, secret: string) => {
  return createHmac("sha256", secret).update(issuedAt).digest("hex");
};

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const isValidAdminCredentials = (
  event: H3Event,
  username: unknown,
  password: unknown,
) => {
  if (typeof username !== "string" || typeof password !== "string") {
    return false;
  }

  const config = getAdminConfig(event);

  return (
    safeEqual(username, config.username) && safeEqual(password, config.password)
  );
};

export const createAdminSession = (event: H3Event) => {
  const config = getAdminConfig(event);
  const issuedAt = String(Date.now());
  const signature = signSession(issuedAt, config.secret);

  setCookie(event, ADMIN_COOKIE_NAME, `${issuedAt}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
};

export const clearAdminSession = (event: H3Event) => {
  deleteCookie(event, ADMIN_COOKIE_NAME, {
    path: "/",
  });
};

export const isAdminAuthenticated = (event: H3Event) => {
  const session = getCookie(event, ADMIN_COOKIE_NAME);

  if (!session) return false;

  const [issuedAt, signature] = session.split(".");

  if (!issuedAt || !signature) return false;

  const issuedAtNumber = Number(issuedAt);

  if (!Number.isFinite(issuedAtNumber)) return false;

  const sessionAge = Date.now() - issuedAtNumber;

  if (sessionAge < 0 || sessionAge > ADMIN_SESSION_MAX_AGE * 1000) {
    return false;
  }

  const { secret } = getAdminConfig(event);
  const expectedSignature = signSession(issuedAt, secret);

  return safeEqual(signature, expectedSignature);
};

export const requireAdminAuth = (event: H3Event) => {
  if (isAdminAuthenticated(event)) return;

  throw createError({
    statusCode: 401,
    statusMessage: "Admin authentication required.",
  });
};
