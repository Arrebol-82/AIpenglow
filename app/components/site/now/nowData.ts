export type FutureEntry = {
  title: string;
  content: string;
};

export type LogEntry = {
  date: string;
  content: string;
};

export const NOW_WATERMARK = "未来";

export const NOW_SCALE_VERTICAL_LINE_1 = "聪明一点点";
export const NOW_SCALE_VERTICAL_LINE_2 = "争取比昨天的自己";
export const NOW_SCALE_QUOTE = "「";

export const NOW_BUTTON_ICON = "↗";
export const NOW_BUTTON_TEXT = "View All Archive";

export const NOW_FUTURE_ENTRIES: FutureEntry[] = [
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
];

export const NOW_FUTURE_LINE_WIDTHS = [60, 30];

export const NOW_LOG_ENTRIES: LogEntry[] = [
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
];
