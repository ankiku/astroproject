import type { Link } from "../types";

export const SITE = {
  title: "Astro News",
  description: "A news website built with Astro",
  author: "Mohammad Rahmani",
  url: "https://astro-news-six.vercel.app",
  github: "https://github.com/Mrahmani71/astro-news",
  locale: "en-US",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 4,
};

export const OTHER_LINKS: Link[] = [
  {
    href: "/rss.xml",
    text: "RSS",
  },
  {
    href: "/sitemap.xml",
    text: "Sitemap",
  },
];

export const OTHER_LINKS1: Link[] = [
  {
    href: "/about",
    text: "About us",
  },
  {
    href: "/privacy",
    text: "Privacy Policy",
  },
  {
    href: "/terms",
    text: "Terms & Conditions",
  },
  {
    href: "/disclaimer",
    text: "Disclaimer",
  },
  {
    href: "/contact",
    text: "Contact Us",
  },
];