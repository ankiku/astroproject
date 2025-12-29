import { render, type CollectionEntry } from "astro:content";
import { authorsHandler } from "@/lib/handlers/authors";
import defaultImage from "@/assets/images/default-image.jpg";
import type { ArticleMeta, Meta } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils/letter";
import { normalizeDate } from "@/lib/utils/date";

type GetMetaCollection = CollectionEntry<"articles" | "views">;

const renderCache = new Map<string, Meta | ArticleMeta>();

export const getMeta = async (
  collection: GetMetaCollection,
  category?: string
): Promise<Meta | ArticleMeta> => {
  try {
    const collectionId = `${collection.collection}-${collection.id}`;

    /* ---------------- ARTICLE META ---------------- */
    if (collection.collection === "articles") {
      if (renderCache.has(collectionId)) {
        return renderCache.get(collectionId)!;
      }

      const { remarkPluginFrontmatter } = await render(collection);
      const authors = authorsHandler.getAuthors(collection.data.authors);

      const meta: ArticleMeta = {
        title: capitalizeFirstLetter(collection.data.title),
        metaTitle: capitalizeFirstLetter(collection.data.title),
        description: collection.data.description,
        ogImage: collection.data.cover?.src || defaultImage.src,
        ogImageAlt:
          collection.data.cover_alt || collection.data.title,
        publishedTime: normalizeDate(collection.data.publishedTime),
        lastModified: remarkPluginFrontmatter.lastModified,
        authors: authors.map((author) => ({
          name: author.data.name,
          link: `${author.id}`,
        })),
        type: "article",
      };

      renderCache.set(collectionId, meta);
      return meta;
    }

    /* ---------------- PAGE META ---------------- */
    if (collection.collection === "views") {
      const cacheKey = category
        ? `${collectionId}-${category}`
        : collectionId;

      if (renderCache.has(cacheKey)) {
        return renderCache.get(cacheKey)!;
      }

      const title =
        collection.id === "categories" && category
          ? capitalizeFirstLetter(category)
          : collection.id === "home"
            ? "Home"
            : capitalizeFirstLetter(collection.data.title);

      const meta: Meta = {
        title,
        metaTitle: capitalizeFirstLetter(collection.data.title),
        description: collection.data.description,
        ogImage: defaultImage.src,
        ogImageAlt: collection.data.title,
        type: "website",
      };

      renderCache.set(cacheKey, meta);
      return meta;
    }

    throw new Error(
      `Invalid collection type: ${(collection as GetMetaCollection).collection
      }`
    );
  } catch (error) {
    console.error(
      `Error generating metadata for ${collection.id}:`,
      error
    );
    throw error;
  }
};
