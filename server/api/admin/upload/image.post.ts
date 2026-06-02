import { createClient } from "@supabase/supabase-js";
import { createError, defineEventHandler, readMultipartFormData } from "h3";

const BUCKET_NAME = "aIpenglow";

const getFileExtension = (filename: string, contentType = "") => {
  const fromName = filename.split(".").pop();

  if (fromName && fromName !== filename) {
    return fromName.toLowerCase();
  }

  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";

  return "webp";
};

const sanitizeFilename = (filename: string) => {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const supabaseUrl = config.public.supabaseUrl;
  const supabaseSecretKey = config.supabaseSecretKey;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Supabase environment variables are missing.",
    });
  }

  const formData = await readMultipartFormData(event);
  const filePart = formData?.find((item) => item.name === "file");

  if (!filePart?.data || !filePart.filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "No image file uploaded.",
    });
  }

  const contentType = filePart.type || "image/webp";

  if (!contentType.startsWith("image/")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Only image files are allowed.",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const extension = getFileExtension(filePart.filename, contentType);
  const baseName = sanitizeFilename(filePart.filename);
  const filePath = `archive/${Date.now()}-${baseName}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, filePart.data, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw createError({
      statusCode: 500,
      statusMessage: uploadError.message,
    });
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
});
