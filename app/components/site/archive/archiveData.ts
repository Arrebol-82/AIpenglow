export type ArchiveProject = {
  title: string;
  role: string;
  year: string;
  image: string;
  note: string;
};

export const projects: ArchiveProject[] = [
  {
    title: "Notion 练习页",
    role: "页面设计",
    year: "2022",
    image: "https://picsum.photos/id/10/400/400",
    note: "首版草图",
  },
  {
    title: "个人品牌提案",
    role: "品牌设计",
    year: "2021",
    image: "https://picsum.photos/id/13/400/400",
    note: "物料研究",
  },
  {
    title: "作品集交互练习",
    role: "界面体验",
    year: "2020",
    image: "https://picsum.photos/id/17/400/400",
    note: "交互推演",
  },
  {
    title: "展览导视实验",
    role: "空间装置",
    year: "2019",
    image: "https://picsum.photos/id/29/400/400",
    note: "空间样张",
  },
  {
    title: "片头节奏练习",
    role: "动效设计",
    year: "2018",
    image: "https://picsum.photos/id/28/400/400",
    note: "镜头归档",
  },
  {
    title: "排版海报练习",
    role: "编辑设计",
    year: "2017",
    image: "https://picsum.photos/id/33/400/400",
    note: "印刷测试",
  },
];
