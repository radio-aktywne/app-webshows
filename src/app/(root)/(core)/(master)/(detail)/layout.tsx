import { connection } from "next/server";

import type { LayoutInput } from "../../../../types";
import type { Keys } from "./types";

import { CoreDetailLayoutView } from "./layout.view";

export default async function CoreDetailLayout({
  children,
  main,
  modals,
}: LayoutInput<Keys.Path, Keys.Slots>) {
  await connection();

  return (
    <CoreDetailLayoutView main={main} modals={modals}>
      {children}
    </CoreDetailLayoutView>
  );
}
