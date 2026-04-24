import sanitizeHtml from "sanitize-html";

const ALLOWED_IFRAME_HOSTS = [
    "youtube.com",
    "www.youtube.com",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
    "youtu.be",
];

export const sanitizeRichTextHtml = (value: string): string => {
    return sanitizeHtml(value, {
        allowedTags: [
            "h1", "h2", "h3", "h4", "h5", "h6",
            "p", "br", "hr",
            "strong", "b", "em", "i", "u", "s", "del", "mark",
            "sup", "sub", "code", "pre", "blockquote",
            "ul", "ol", "li",
            "table", "thead", "tbody", "tfoot", "tr", "th", "td",
            "img", "figure", "figcaption", "iframe",
            "div", "span", "section", "article",
            "a",
        ],
        allowedAttributes: {
            "*": ["class", "style"],
            "a": ["href", "title", "target", "rel"],
            "img": ["src", "alt", "title", "width", "height"],
            "table": ["border", "cellpadding", "cellspacing"],
            "th": ["colspan", "rowspan", "scope"],
            "td": ["colspan", "rowspan"],
            "iframe": [
                "src",
                "allow",
                "allowfullscreen",
                "frameborder",
                "scrolling",
                "loading",
                "referrerpolicy",
                "width",
                "height",
            ],
        },
        allowedIframeHostnames: ALLOWED_IFRAME_HOSTS,
        disallowedTagsMode: "discard",
    });
};