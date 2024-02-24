import { CustomError } from "../structures/CustomError";

export default function onlyDev(id: string) {
	return Promise.reject(
		new CustomError({
			error: "Comando en desarrollo",
			description: "El comando que intentas usar está en desarrollo",
		}),
	);
}
