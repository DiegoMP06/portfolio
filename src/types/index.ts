import type { Category, Media, Project, Status, User } from "astro:db";

export type NavLink = {
    label: string;
    href: string;
};

export type UserType = typeof User.$inferSelect;

type Auth = {
    password: string;
    passwordConfirmation: string;
    currentPassword: string;
};

export type LoginFormData = Pick<UserType, "email" | "password">;

export type ForgotPasswordData = Pick<UserType, "email">;

export type ResetPasswordData = Pick<Auth, "password" | "passwordConfirmation">;

export type NewPasswordData = Pick<
    Auth,
    "currentPassword" | "password" | "passwordConfirmation"
>;

export type EditUserData = Pick<UserType, "name" | "email">;

export type ProjectType = typeof Project.$inferSelect;

export type CategoryType = typeof Category.$inferSelect;

export type StatusType = typeof Status.$inferSelect;

export type MediaType = typeof Media.$inferSelect;

export type DraftProject = Pick<
    ProjectType,
    "name" | "description" | "content" | "demoUrl" | "githubUrl" | "statusId"
> & {
    stack: string[];
    images?: string[];
    categories: CategoryType["id"][];
};

export type FormattedProject = ProjectType & {
    status: StatusType["name"];
    media: Pick<MediaType, "url" | "featured" | "id">[];
    categories: CategoryType[];
};

export type LayoutProps = {
    title?: string;
    description?: string;
    image?: string;
    robots?: string;
    ogType?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
    schema?: Record<string, unknown> | Record<string, unknown>[];
};
