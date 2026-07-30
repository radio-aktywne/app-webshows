import { connection } from "next/server";

import type { LayoutInput } from "../../../types";
import type { Keys } from "./types";

import { Authenticated } from "../../../../server/access/components/authenticated";
import { CoreMasterLayoutView } from "./layout.view";

export default async function CoreMasterLayout({
  children,
}: LayoutInput<Keys.Path, Keys.Slots>) {
  await connection();

  return (
    <Authenticated>
      <CoreMasterLayoutView>{children}</CoreMasterLayoutView>
    </Authenticated>
  );
}
