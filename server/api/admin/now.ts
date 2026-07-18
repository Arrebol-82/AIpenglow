import { createClient } from "@supabase/supabase-js";
import { createError, defineEventHandler, getMethod, readBody } from "h3";

const PAGE_KEY = "now";

type FutureEntry = {
  title: string;
  content: string;
};

type LogEntry = {
  date: string;
  content: string;
};

type NowContent = {
  watermark: string;
  scaleVerticalLine1: string;
  scaleVerticalLine2: string;
  scaleQuote: string;
  buttonIcon: string;
  buttonText: string;
  futureLineWidths: number[];
  futureEntries: FutureEntry[];
  logEntries: LogEntry[];
};

const defaultContent: NowContent = {
  watermark: "未来",
  scaleVerticalLine1: "聪明一点点",
  scaleVerticalLine2: "争取比昨天的自己",
  scaleQuote: "「",
  buttonIcon: "↗",
  buttonText: "View All Archive",
  futureLineWidths: [60, 30],
  futureEntries: [
    {
      title: "把个人网站继续打磨完整",
      content: "把页面细节、节奏和内容慢慢收拢到更舒服的状态。",
    },
    {
      title: "梳理并明确系统学习路线",
      content: "先把大方向给整理出来，明确要学习的路径。",
    },
    {
      title: "把剩下的书本看完",
      content:
        "看书嘛，其实挺快乐的，不过痛苦居多——但能偶尔发现‘有点意思’的逻辑就够了。",
    },
    {
      title: "记录每天干的事情",
      content: "把每天的进度和事情记录下来 , 方便日后进行复盘",
    },
    {
      title: "保持节奏，不急着证明什么",
      content: "先把眼前的事做好，再慢慢把路走宽。",
    },
  ],
  logEntries: [
    {
      date: "04 / 02",
      content:
        "在改个人网站的排版，把 Inspiration 和 Now 这两块重新搭得更顺一点。",
    },
    {
      date: "04 / 01",
      content:
        "看了一些 Nuxt 和服务端接口的写法，也顺手接了 Last.fm 的最近播放。",
    },
    {
      date: "03 / 31",
      content: "把最近想做的方向重新整理了一遍，尽量只留下真正会去做的事情。",
    },
    {
      date: "03 / 30",
      content: "花时间看了点后端知识，也在想怎么把学习过程写得更真诚一点。",
    },
    {
      date: "03 / 29",
      content:
        "把页面细节重新看了一遍，想让每个区块都更安静一点，也更像现在真正的状态。",
    },
    {
      date: "03 / 28",
      content:
        "晚上读了一些英文技术文章，速度还是慢，但比之前更愿意沉下心把它们看完。",
    },
    {
      date: "03 / 27",
      content: "把一些页面动效重新拆开想了一遍，先保证结构清楚，再慢慢补细节。",
    },
    {
      date: "03 / 26",
      content:
        "整理了最近写过的组件，发现很多问题不是技术难，而是节奏没有提前想好。",
    },
    {
      date: "03 / 25",
      content: "试着把每天做过的事情记下来，哪怕只是一点点，也比完全忘掉要好。",
    },
    {
      date: "03 / 24",
      content:
        "继续调整个人网站的视觉关系，让内容、留白和交互都更接近自己想要的状态。",
    },
    {
      date: "03 / 23",
      content: "看了一些前端动画案例，重点不是炫，而是让页面的移动逻辑更自然。",
    },
    {
      date: "03 / 22",
      content: "把项目目录重新过了一遍，准备把后面要补的模块按优先级排出来。",
    },
  ],
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isEmptyObject = (value: unknown) => {
  return isObject(value) && Object.keys(value).length === 0;
};

const toStringValue = (value: unknown, fallback: string) => {
  return typeof value === "string" ? value : fallback;
};

const normalizeFutureEntries = (value: unknown): FutureEntry[] => {
  if (!Array.isArray(value)) return defaultContent.futureEntries;

  const entries = value
    .filter(isObject)
    .map((item) => ({
      title: toStringValue(item.title, ""),
      content: toStringValue(item.content, ""),
    }))
    .filter((item) => item.title.trim() || item.content.trim());

  return entries.length > 0
    ? entries.slice(0, 5)
    : defaultContent.futureEntries;
};

const normalizeLogEntries = (value: unknown): LogEntry[] => {
  if (!Array.isArray(value)) return defaultContent.logEntries;

  const entries = value
    .filter(isObject)
    .map((item) => ({
      date: toStringValue(item.date, ""),
      content: toStringValue(item.content, ""),
    }))
    .filter((item) => item.date.trim() || item.content.trim());

  return entries.length > 0 ? entries : defaultContent.logEntries;
};

const normalizeLineWidths = (value: unknown) => {
  if (!Array.isArray(value)) return defaultContent.futureLineWidths;

  const widths = value.filter(
    (item): item is number => typeof item === "number" && !Number.isNaN(item),
  );

  return widths.length > 0 ? widths : defaultContent.futureLineWidths;
};

const normalizeContent = (content: unknown): NowContent => {
  if (!isObject(content) || isEmptyObject(content)) {
    return defaultContent;
  }

  return {
    watermark: toStringValue(content.watermark, defaultContent.watermark),
    scaleVerticalLine1: toStringValue(
      content.scaleVerticalLine1,
      defaultContent.scaleVerticalLine1,
    ),
    scaleVerticalLine2: toStringValue(
      content.scaleVerticalLine2,
      defaultContent.scaleVerticalLine2,
    ),
    scaleQuote: toStringValue(content.scaleQuote, defaultContent.scaleQuote),
    buttonIcon: toStringValue(content.buttonIcon, defaultContent.buttonIcon),
    buttonText: toStringValue(content.buttonText, defaultContent.buttonText),
    futureLineWidths: normalizeLineWidths(content.futureLineWidths),

    // 主要使用 nowData.ts 对应字段
    futureEntries: normalizeFutureEntries(
      content.futureEntries ?? content.goals,
    ),
    logEntries: normalizeLogEntries(content.logEntries ?? content.dailyLogs),
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
      .from("now_page")
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
        .from("now_page")
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
    .from("now_page")
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
