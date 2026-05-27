// ---------------------------------------------------------------------------
// SectionMe – static text content & log entries
// ---------------------------------------------------------------------------

export interface LogEntry {
  label: string;
  content: string;
}

export const ME_TOP_LABEL =
  "Alpenglow Psychological Audit Archive // Variant 2";

export const ME_REF_PT_LABEL = "REF_PT\nA-45";

export const ME_LOG_ENTRIES: LogEntry[] = [
  {
    label: "LOG // 1.1",
    content: "我是一个挺复杂的人。因为我其实并不了解自己。",
  },
  {
    label: "LOG // 1.2",
    content:
      "我不知道自己真正热爱什么，却总会逼着自己往前走，所以也常常被情绪和环境拉住。",
  },
  {
    label: "LOG // 1.3",
    content:
      "我不是那种稳定、清晰的人，常常会分心、迟疑，也会自我怀疑。\n\n直到现在，我还在学着和自己相处，也还在慢慢弄清楚，我到底想成为什么样的人。",
  },
];

export const ME_AUDIT_SEC_LABEL = "AUDIT_SEC\n02";
