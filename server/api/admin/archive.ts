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

const defaultContent: ArchiveContent = {
  projects: [
    {
      title: "Notion 练习页",
      role: "页面设计",
      year: "2022",
      image:
        "https://tciiblndsullnuezeshr.supabase.co/storage/v1/object/public/aIpenglow/archive1.webp",
      note: "首版草图",
    },
    {
      title: "个人品牌提案",
      role: "品牌设计",
      year: "2021",
      image:
        "https://tciiblndsullnuezeshr.supabase.co/storage/v1/object/public/aIpenglow/archive2.webp",
      note: "物料研究",
    },
    {
      title: "作品集交互练习",
      role: "界面体验",
      year: "2020",
      image:
        "https://tciiblndsullnuezeshr.supabase.co/storage/v1/object/public/aIpenglow/archive3.webp",
      note: "交互推演",
    },
    {
      title: "展览导视实验",
      role: "空间装置",
      year: "2019",
      image:
        "https://tciiblndsullnuezeshr.supabase.co/storage/v1/object/public/aIpenglow/archive4.webp",
      note: "空间样张",
    },
    {
      title: "片头节奏练习",
      role: "动效设计",
      year: "2018",
      image:
        "https://tciiblndsullnuezeshr.supabase.co/storage/v1/object/public/aIpenglow/archive5.png",
      note: "镜头归档",
    },
    {
      title: "排版海报练习",
      role: "编辑设计",
      year: "2017",
      image:
        "https://tciiblndsullnuezeshr.supabase.co/storage/v1/object/public/aIpenglow/archive6.png",
      note: "印刷测试",
    },
  ],
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isEmptyObject = (value: unknown) => {
  return isObject(value) && Object.keys(value).length === 0;
};

const toStringValue = (value: unknown, fallback = "") => {
  return typeof value === "string" ? value : fallback;
};

const normalizeProjects = (value: unknown): ArchiveProject[] => {
  if (!Array.isArray(value)) return defaultContent.projects;

  const projects = value
    .filter(isObject)
    .map((item) => ({
      title: toStringValue(item.title, "未命名作品"),
      role: toStringValue(item.role, "作品类型"),
      year: toStringValue(item.year, String(new Date().getFullYear())),
      image: toStringValue(item.image, ""),
      note: toStringValue(item.note, "作品备注"),
    }))
    .filter((item) => item.title.trim() || item.image.trim());

  return projects.length > 0 ? projects : defaultContent.projects;
};

const normalizeContent = (content: unknown): ArchiveContent => {
  if (!isObject(content) || isEmptyObject(content)) {
    return defaultContent;
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
      const { data: createdData, error: createErrorData } = await supabase
        .from("archive_page")
        .upsert(
          {
            page_key: PAGE_KEY,
            content: defaultContent,
            is_published: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "page_key",
          },
        )
        .select("id, page_key, content, is_published, updated_at")
        .single();

      if (createErrorData) {
        throw createError({
          statusCode: 500,
          statusMessage: createErrorData.message,
        });
      }

      return {
        id: createdData.id,
        pageKey: createdData.page_key,
        content: normalizeContent(createdData.content),
        isPublished: createdData.is_published,
        updatedAt: createdData.updated_at,
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
