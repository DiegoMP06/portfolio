import {
	Category,
	db,
	Media,
	PasswordResetToken,
	Project,
	ProjectCategory,
	Session,
	Status,
	User,
} from "astro:db";
import { hashPassword } from "../src/lib/password";

// https://astro.build/db/seed
export default async function seed() {
	await Promise.allSettled([
		db.delete(User),
		db.delete(Session),
		db.delete(PasswordResetToken),
		db.delete(Category),
		db.delete(Status),
		db.delete(Project),
		db.delete(Media),
		db.delete(ProjectCategory),
	]);

	const statuses = [
		"En desarrollo",
		"En revisión",
		"Publicado",
		"En mantenimiento",
		"Archivado",
	];

	const categories = [
		"Desarrollo Web",
		"Inteligencia Artificial",
		"Sistemas Embebidos e IoT",
		"Aplicaciones Móviles",
		"Ciberseguridad",
		"Ciencia de Datos",
		"Videojuegos y Multimedia",
		"Investigación Tecnológica",
		"DevOps e Infraestructura",
		"Proyectos de Comunidad",
	];

	const envName = import.meta.env.USER_NAME
	const envEmail = import.meta.env.USER_MAIL
	const envPassword = import.meta.env.USER_PASS

	const password = await hashPassword(envPassword);

	const inserts = [
		db.insert(User).values({
			name: envName,
			email: envEmail,
			password,
		}),
		db.insert(Status).values(statuses.map((status) => ({ name: status }))),
		db
			.insert(Category)
			.values(categories.map((category) => ({ name: category }))),
	];

	await Promise.allSettled(inserts);

	console.log("Seed complete");
}
