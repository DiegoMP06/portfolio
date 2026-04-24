import { JSDOM } from "jsdom";
import * as DOMPurifyModule from "dompurify";

type DOMPurifyFactory = (window: unknown) => {
    sanitize: (value: string, config?: Record<string, unknown>) => string;
    addHook: (name: string, hook: (node: Node) => void) => void;
};

const createDOMPurify = ((DOMPurifyModule as unknown as { default?: DOMPurifyFactory }).default ??
    (DOMPurifyModule as unknown as DOMPurifyFactory)) as DOMPurifyFactory;

const { window } = new JSDOM("", { url: "https://example.com" });
const DOMPurify = createDOMPurify(window as unknown as any);

const ALLOWED_IFRAME_HOSTS = new Set([
    "youtube.com",
    "www.youtube.com",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
    "youtu.be",
]);

const hasAllowedIframeHost = (src: string) => {
    try {
        const url = new URL(src, "https://example.com");
        return ALLOWED_IFRAME_HOSTS.has(url.hostname);
    } catch {
        return false;
    }
};

DOMPurify.addHook("uponSanitizeElement", (node) => {
    if (node.nodeName.toLowerCase() !== "iframe") return;

    const iframe = node as Element;
    const src = iframe.getAttribute("src") ?? "";

    if (!hasAllowedIframeHost(src)) {
        iframe.remove();
    }
});

export const sanitizeRichTextHtml = (value: string) => {
    return DOMPurify.sanitize(value, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: [
            "script",
            "style",
            "object",
            "embed",
            "link",
            "meta",
            "base",
            "form",
            "input",
            "button",
            "textarea",
            "select",
            "option",
            "frame",
            "frameset",
        ],
        ADD_TAGS: ["iframe"],
        ADD_ATTR: [
            "allow",
            "allowfullscreen",
            "frameborder",
            "scrolling",
            "loading",
            "referrerpolicy",
        ],
    });
};
