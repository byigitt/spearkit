import { docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";

/** The docs content source, mounted at /docs. */
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
