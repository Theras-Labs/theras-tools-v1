import { BiTask, BiHelpCircle } from "react-icons/bi";
import { TbCategory2 } from "react-icons/tb";
import { BsDiscord, BsChatDots } from "react-icons/bs";
import { getPath } from "src/lib/const";
import { Settings } from "tabler-icons-react";

export const ITEMS = [
  {
    href: getPath("INDEX"),
    label: "Dashboard",
    Icon: TbCategory2,
    size: "1.5rem",
  },
  {
    href: getPath("MY_COURSES"),
    label: "My Courses",
    Icon: BiTask,
  },
  {
    href: "https://discord.gg/AwUYM74R",
    label: "Discord",
    Icon: BsDiscord,
  },
  {
    href: getPath("GROUP_CHAT"),
    label: "Group Chat",
    Icon: BsChatDots,
    comingSoon: true,
  },
];

export const ITEMS_PROFILE = [
  {
    href: getPath("SETTINGS"),
    label: "Settings",
    Icon: Settings,
  },
  {
    href: getPath("HELP"),
    label: "Help",
    Icon: BiHelpCircle,
  },
];
