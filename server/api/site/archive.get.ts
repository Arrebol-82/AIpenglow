import { createClient } from "@supabase/supabase-js";
import { defineEventHandler } from "h3";

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
  const config = useRuntimeConfig(event);

  const supabaseUrl = config.public.supabaseUrl;
  const supabaseSecretKey = config.supabaseSecretKey;

  if (!supabaseUrl || !supabaseSecretKey) {
    return emptyContent;
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const { data, error } = await supabase
      .from("archive_page")
      .select("content")
      .eq("page_key", PAGE_KEY)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) {
      return emptyContent;
    }

    return normalizeContent(data.content);
  } catch {
    return emptyContent;
  }
});
