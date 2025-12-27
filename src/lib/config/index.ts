import type { Link } from "../types";

export const SITE = {
  title: "Astro News",
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
    href: "/privacy-policy",
    text: "Privacy Policy",
  },
  {
    href: "/terms-and-conditions",
    text: "Terms & Conditions",
  },
  {
    href: "/disclaimer",
    text: "Disclaimer",
  },
  {
    href: "/contact-us",
    text: "Contact Us",
  },
];