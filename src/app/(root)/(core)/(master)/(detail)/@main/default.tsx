import { connection } from "next/server";

import type { DefaultInput } from "../../../../../types";
import type { Keys } from "./types";

import { Authenticated } from "../../../../../../server/access/components/authenticated";
import { MainDefaultView } from "./default.view";

export default async function MainDefault({}: DefaultInput<Keys.Path>) {
  await connection();

  return (
    <Authenticated>
      <MainDefaultView />
    </Authenticated>
  );
}
