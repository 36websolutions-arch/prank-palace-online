import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const BASE_URL = "https://corporatepranks.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

function setMetaTag(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageMeta({ title, description, image, url }: PageMeta) {
  useEffect(() => {
    const fullTitle = title === "CorporatePranks" ? title : `${title} | CorporatePranks`;
    const fullImage = image?.startsWith("http") ? image : `${BASE_URL}${image || ""}`;
    const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    document.title = fullTitle;

    // Standard meta
    setMetaTag("description", description, true);

    // Open Graph
    setMetaTag("og:title", fullTitle);
    setMetaTag("og:description", description);
    setMetaTag("og:image", image ? fullImage : DEFAULT_IMAGE);
    setMetaTag("og:url", fullUrl);

    // Twitter
    setMetaTag("twitter:title", fullTitle, true);
    setMetaTag("twitter:description", description, true);
    setMetaTag("twitter:image", image ? fullImage : DEFAULT_IMAGE, true);

    return () => {
      document.title = "CorporatePranks";
    };
  }, [title, description, image, url]);
}
