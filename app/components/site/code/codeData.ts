import geminiColorIcon from "~/components/Icons/gemini-color.svg";

export const techTags = [
  {
    label: "JavaScript",
    variant: "javascript",
    type: "icon",
    icon: "logos:javascript",
  },
  { label: "Vue", variant: "vue", type: "icon", icon: "logos:vue" },
  { label: "Nuxt", variant: "nuxt", type: "icon", icon: "logos:nuxt-icon" },
  {
    label: "TypeScript",
    variant: "typescript",
    type: "icon",
    icon: "logos:typescript-icon",
  },
  { label: "Vite", variant: "vite", type: "icon", icon: "logos:vitejs" },
  { label: "GPT", variant: "gpt", type: "icon", icon: "logos:openai-icon" },
  {
    label: "Gemini",
    variant: "gemini",
    type: "image",
    icon: geminiColorIcon,
  },
] as const;
