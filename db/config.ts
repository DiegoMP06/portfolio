import { column, defineDb, defineTable } from "astro:db";

const User = defineTable({
    columns: {
        id: column.number({ primaryKey: true, optional: false }),
        name: column.text({ optional: false }),
        email: column.text({ optional: false, unique: true }),
        password: column.text({ optional: false }),
    },
});

const Session = defineTable({
    columns: {
        id: column.text({
            primaryKey: true,
            optional: false,
            autoIncrement: true,
            unique: true,
        }),
        userId: column.number({
            optional: false,
            references: () => User.columns.id,
        }),
        expiresAt: column.date(),
    },
});

const PasswordResetToken = defineTable({
    columns: {
        tokenHash: column.text({
            primaryKey: true,
            optional: false,
            unique: true,
        }),
        userId: column.number({
            optional: false,
            references: () => User.columns.id,
        }),
        expiresAt: column.date({ optional: false }),
    },
});

const Category = defineTable({
    columns: {
        id: column.number({
            primaryKey: true,
            optional: false,
            autoIncrement: true,
            unique: true,
        }),
        name: column.text({ optional: false }),
    },
});

const Status = defineTable({
    columns: {
        id: column.number({
            primaryKey: true,
            optional: false,
            autoIncrement: true,
            unique: true,
        }),
        name: column.text({ optional: false }),
    },
});

const Project = defineTable({
    columns: {
        id: column.number({
            primaryKey: true,
            optional: false,
            autoIncrement: true,
            unique: true,
        }),
        name: column.text({ optional: false }),
        slug: column.text({ optional: false, unique: true }),
        description: column.text({ optional: false }),
        content: column.text({ optional: false }),
        demoUrl: column.text({ optional: true }),
        githubUrl: column.text({ optional: false }),
        stack: column.json({ optional: false }),
        featured: column.boolean({ default: false, optional: false }),
        statusId: column.number({
            optional: false,
            references: () => Status.columns.id,
        }),
        createdAt: column.date({ optional: false }),
        updatedAt: column.date({ optional: true }),
    },
});

const Media = defineTable({
    columns: {
        id: column.number({
            primaryKey: true,
            optional: false,
            autoIncrement: true,
            unique: true,
        }),
        url: column.text({ optional: false }),
        featured: column.boolean({ default: false, optional: false }),
        projectId: column.number({
            optional: false,
            references: () => Project.columns.id,
        }),
        createdAt: column.date({ optional: false }),
        updatedAt: column.date({ optional: true }),
    },
});

const ProjectCategory = defineTable({
    columns: {
        id: column.number({
            primaryKey: true,
            optional: false,
            autoIncrement: true,
            unique: true,
        }),
        projectId: column.number({
            optional: false,
            references: () => Project.columns.id,
        }),
        categoryId: column.number({
            optional: false,
            references: () => Category.columns.id,
        }),
    },
});

// https://astro.build/db/config
export default defineDb({
    tables: {
        User,
        Session,
        PasswordResetToken,
        Category,
        Status,
        Project,
        Media,
        ProjectCategory,
    },
});
