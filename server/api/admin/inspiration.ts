import { createClient } from "@supabase/supabase-js";
import { createError, defineEventHandler, getMethod, readBody } from "h3";

const SECTION_KEY = "inspiration";
const SECTION_TITLE = "Inspiration";

interface InspirationContent {
  music: {
    favoriteSong: string;
  };
  book: {
    currentBook: string;
    insight: string;
    progress: number;
    readingTime: string;
    favoriteBook: string;
    favoriteBookQuote1: string;
    favoriteBookQuote2: string;
  };
  film: {
    currentFilm: string;
    filmQuote: string;
    favoriteFilm: string;
    favoriteFilmQuote1: string;
    favoriteFilmQuote2: string;
  };
}

const defaultContent: InspirationContent = {
  music: {
    favoriteSong: "Already Gone",
  },
  book: {
    currentBook: "穷查理宝典",
    insight:
      "“反向思考，总是反向思考。” 一个解决问题的基本思维模型：专注于避免愚蠢而不是寻求辉煌。",
    progress: 45,
    readingTime: "阅读时间：10月 24日",
    favoriteBook: "杀死一只知更鸟",
    favoriteBookQuote1: "有一种东西不能遵循从众原则，那就是人的良心。",
    favoriteBookQuote2: "",
  },
  film: {
    currentFilm: "魔女宅急便",
    filmQuote: "内心 - 停一停",
    favoriteFilm: "幽灵公主",
    favoriteFilmQuote1: "活下去/生きろ，你很美",
    favoriteFilmQuote2: "用澄澈无暇的眼睛看清事实",
  },
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toStringValue = (value: unknown, fallback: string) => {
  return typeof value === "string" ? value : fallback;
};

const toProgressValue = (value: unknown, fallback: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
};

const normalizeContent = (content: unknown): InspirationContent => {
  const source = isObject(content) ? content : {};

  const music = isObject(source.music) ? source.music : {};
  const book = isObject(source.book) ? source.book : {};
  const film = isObject(source.film) ? source.film : {};

  return {
    music: {
      favoriteSong: toStringValue(
        music.favoriteSong,
        defaultContent.music.favoriteSong,
      ),
    },
    book: {
      currentBook: toStringValue(
        book.currentBook,
        defaultContent.book.currentBook,
      ),
      insight: toStringValue(book.insight, defaultContent.book.insight),
      progress: toProgressValue(book.progress, defaultContent.book.progress),
      readingTime: toStringValue(
        book.readingTime,
        defaultContent.book.readingTime,
      ),
      favoriteBook: toStringValue(
        book.favoriteBook,
        defaultContent.book.favoriteBook,
      ),
      favoriteBookQuote1: toStringValue(
        book.favoriteBookQuote1,
        defaultContent.book.favoriteBookQuote1,
      ),
      favoriteBookQuote2: toStringValue(
        book.favoriteBookQuote2,
        defaultContent.book.favoriteBookQuote2,
      ),
    },
    film: {
      currentFilm: toStringValue(
        film.currentFilm,
        defaultContent.film.currentFilm,
      ),
      filmQuote: toStringValue(film.filmQuote, defaultContent.film.filmQuote),
      favoriteFilm: toStringValue(
        film.favoriteFilm,
        defaultContent.film.favoriteFilm,
      ),
      favoriteFilmQuote1: toStringValue(
        film.favoriteFilmQuote1,
        defaultContent.film.favoriteFilmQuote1,
      ),
      favoriteFilmQuote2: toStringValue(
        film.favoriteFilmQuote2,
        defaultContent.film.favoriteFilmQuote2,
      ),
    },
  };
};

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (!["GET", "POST", "PUT"].includes(method)) {
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
      .from("site_sections")
      .select("id, section_key, title, content, is_published, updated_at")
      .eq("section_key", SECTION_KEY)
      .maybeSingle();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    if (!data) {
      const { data: createdData, error: createErrorData } = await supabase
        .from("site_sections")
        .insert({
          section_key: SECTION_KEY,
          title: SECTION_TITLE,
          content: defaultContent,
          is_published: true,
        })
        .select("id, section_key, title, content, is_published, updated_at")
        .single();

      if (createErrorData) {
        throw createError({
          statusCode: 500,
          statusMessage: createErrorData.message,
        });
      }

      return {
        id: createdData.id,
        sectionKey: createdData.section_key,
        title: createdData.title,
        content: normalizeContent(createdData.content),
        isPublished: createdData.is_published,
        updatedAt: createdData.updated_at,
      };
    }

    return {
      id: data.id,
      sectionKey: data.section_key,
      title: data.title,
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
    .from("site_sections")
    .upsert(
      {
        section_key: SECTION_KEY,
        title: SECTION_TITLE,
        content,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "section_key",
      },
    )
    .select("id, section_key, title, content, is_published, updated_at")
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return {
    id: data.id,
    sectionKey: data.section_key,
    title: data.title,
    content: normalizeContent(data.content),
    isPublished: data.is_published,
    updatedAt: data.updated_at,
  };
});
