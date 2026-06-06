import { connection } from "next/server";

import type { LayoutInput } from "../../../types";
import type { Keys } from "./types";

import { Authenticated } from "../../../../server/access/components/authenticated";
import { EventsMasterLayoutView } from "./layout.view";

export default async function EventsMasterLayout({
  children,
}: LayoutInput<Keys.Path, Keys.Slots>) {
  await connection();

  return (
    <Authenticated>
      <EventsMasterLayoutView>{children}</EventsMasterLayoutView>
    </Authenticated>
  );
}
