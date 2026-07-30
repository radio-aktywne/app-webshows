import { connection } from "next/server";

import type { LoadingInput } from "../../../../../types";

import { ModalsLoadingView } from "./loading.view";

export default async function ModalsLoading({}: LoadingInput) {
  await connection();

  return <ModalsLoadingView />;
}
