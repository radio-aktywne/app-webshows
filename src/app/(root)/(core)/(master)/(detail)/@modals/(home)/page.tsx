import { connection } from "next/server";

import type { PageInput } from "../../../../../../types";
import type { Keys } from "./types";

export default async function ModalsHomePage({}: PageInput<
  Keys.Path,
  Keys.Query
>) {
  await connection();

  return null;
}
