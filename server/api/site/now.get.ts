import { createClient } from "@supabase/supabase-js";

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

const emptyContent: NowContent = {
  watermark: "",
  scaleVerticalLine1: "",
  scaleVerticalLine2: "",
  scaleQuote: "",
  buttonIcon: "",
  buttonText: "",
  futureLineWidths: [],
  futureEntries: [],
  logEntries: [],
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toStringValue = (value: unknown, fallback: string) => {
  return typeof value === "string" ? value : fallback;
};

const normalizeFutureEntries = (
  value: unknown,
  fallback: FutureEntry[],
): FutureEntry[] => {
  if (!Array.isArray(value)) return fallback;

  const entries = value
    .filter(isObject)
    .map((item) => ({
      title: toStringValue(item.title, ""),
      content: toStringValue(item.content, ""),
    }))
    .filter((item) => item.title.trim() || item.content.trim());

  return entries.length > 0 ? entries : fallback;
};

const normalizeLogEntries = (
  value: unknown,
  fallback: LogEntry[],
): LogEntry[] => {
  if (!Array.isArray(value)) return fallback;

  const entries = value
    .filter(isObject)
    .map((item) => ({
      date: toStringValue(item.date, ""),
      content: toStringValue(item.content, ""),
    }))
    .filter((item) => item.date.trim() || item.content.trim());

  return entries.length > 0 ? entries : fallback;
};

const normalizeLineWidths = (value: unknown, fallback: number[]) => {
  if (!Array.isArray(value)) return fallback;

  const widths = value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));

  return widths.length > 0 ? widths : fallback;
};

const normalizeContent = (content: unknown): NowContent => {
  if (!isObject(content)) return emptyContent;

  return {
    watermark: toStringValue(content.watermark, emptyContent.watermark),
    scaleVerticalLine1: toStringValue(
      content.scaleVerticalLine1,
      emptyContent.scaleVerticalLine1,
    ),
    scaleVerticalLine2: toStringValue(
      content.scaleVerticalLine2,
      emptyContent.scaleVerticalLine2,
    ),
    scaleQuote: toStringValue(content.scaleQuote, emptyContent.scaleQuote),
    buttonIcon: toStringValue(content.buttonIcon, emptyContent.buttonIcon),
    buttonText: toStringValue(content.buttonText, emptyContent.buttonText),
    futureLineWidths: normalizeLineWidths(
      content.futureLineWidths,
      emptyContent.futureLineWidths,
    ),
    futureEntries: normalizeFutureEntries(
      content.futureEntries ?? content.goals,
      emptyContent.futureEntries,
    ),
    logEntries: normalizeLogEntries(
      content.logEntries ?? content.dailyLogs,
      emptyContent.logEntries,
    ),
  };
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseSecretKey = config.supabaseSecretKey;

  if (!supabaseUrl || !supabaseSecretKey) {
    return { content: emptyContent };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("now_page")
      .select("content")
      .eq("page_key", PAGE_KEY)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) {
      return { content: emptyContent };
    }

    return { content: normalizeContent(data.content) };
  } catch {
    return { content: emptyContent };
  }
});
