import { msg } from "@lingui/core/macro";
import { connection } from "next/server";

import type {
  PageInput,
  PageMetadataInput,
  PageMetadataUtilityInput,
} from "../../../../../../../types";
import type { Schemas } from "./schemas";
import type { Keys } from "./types";

import { Metadata } from "../../../../../../../../isomorphic/metadata/components/metadata";
import { Authenticated } from "../../../../../../../../server/access/components/authenticated";
import { createMetadata } from "../../../../../../../../server/metadata/lib/create-metadata";
import { ModalsEventsNewPageView } from "./page.view";

async function getTitle({}: PageMetadataUtilityInput<
  typeof Schemas.Path,
  typeof Schemas.Query
>) {
  return msg({ message: "Create event • tulip" });
}

export async function generateMetadata({}: PageMetadataInput<
  Keys.Path,
  Keys.Query
>) {
  return await createMetadata({
    title: await getTitle({}),
  });
}

export default async function ModalsEventsNewPage({}: PageInput<
  Keys.Path,
  Keys.Query
>) {
  await connection();

  return (
    <Authenticated>
      <Metadata title={await getTitle({})} />
      <ModalsEventsNewPageView />
    </Authenticated>
  );
}
