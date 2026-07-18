import { createClient } from "@supabase/supabase-js";
import { createError, defineEventHandler, getMethod, readBody } from "h3";

const PAGE_KEY = "archive";

type ArchiveProject = {
  title: string;
  role: string;
  year: string;
  image: string;
  note: string;
};

type ArchiveContent = {
  projects: ArchiveProject[];
};

const emptyContent: ArchiveContent = {
  projects: [],
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toStringValue = (value: unknown, fallback = "") => {
  return typeof value === "string" ? value : fallback;
};

const normalizeProjects = (value: unknown): ArchiveProject[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isObject)
    .map((item) => ({
      title: toStringValue(item.title),
      role: toStringValue(item.role),
      year: toStringValue(item.year),
      image: toStringValue(item.image),
      note: toStringValue(item.note),
    }))
    .filter((item) => {
      return (
        item.title.trim() ||
        item.role.trim() ||
        item.year.trim() ||
        item.image.trim() ||
        item.note.trim()
      );
    });
};

const normalizeContent = (content: unknown): ArchiveContent => {
  if (!isObject(content)) {
    return emptyContent;
  }

  return {
    projects: normalizeProjects(content.projects),
  };
};

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (!["GET", "POST"].includes(method)) {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  if (method !== "GET") {
    requireAdminAuth(event);
  }

  const config = useRuntimeConfig(event);

  const supabaseUrl = config.public.supabaseUrl;
  const supabaseSecretKey = config.supabaseSecretKey;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Supabase environment variables are missing.",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  if (method === "GET") {
    const { data, error } = await supabase
      .from("archive_page")
      .select("id, page_key, content, is_published, updated_at")
      .eq("page_key", PAGE_KEY)
      .maybeSingle();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    if (!data) {
      return {
        id: null,
        pageKey: PAGE_KEY,
        content: emptyContent,
        isPublished: true,
        updatedAt: null,
      };
    }

    return {
      id: data.id,
      pageKey: data.page_key,
      content: normalizeContent(data.content),
      isPublished: data.is_published,
      updatedAt: data.updated_at,
    };
  }

  const body = await readBody<unknown>(event);
  const bodyObject = isObject(body) ? body : {};
  const rawContent = isObject(bodyObject.content)
    ? bodyObject.content
    : bodyObject;
  const content = normalizeContent(rawContent);

  const { data, error } = await supabase
    .from("archive_page")
    .upsert(
      {
        page_key: PAGE_KEY,
        content,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "page_key",
      },
    )
    .select("id, page_key, content, is_published, updated_at")
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return {
    id: data.id,
    pageKey: data.page_key,
    content: normalizeContent(data.content),
    isPublished: data.is_published,
    updatedAt: data.updated_at,
  };
});
