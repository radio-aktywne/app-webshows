import { msg } from "@lingui/core/macro";
import { connection } from "next/server";

import type {
  PageInput,
  PageMetadataInput,
  PageMetadataUtilityInput,
} from "../../../../../types";
import type { Keys } from "./types";

import { Metadata } from "../../../../../../isomorphic/metadata/components/metadata";
import { Authenticated } from "../../../../../../server/access/components/authenticated";
import { createMetadata } from "../../../../../../server/metadata/lib/create-metadata";
import { EventsPageView } from "./page.view";
import { Schemas } from "./schemas";

async function getTitle({}: PageMetadataUtilityInput<
  typeof Schemas.Path,
  typeof Schemas.Query
>) {
  return msg({ message: "Events • tulip" });
}

export async function generateMetadata({
  searchParams,
}: PageMetadataInput<Keys.Path, Keys.Query>) {
  const queryParameters = await Schemas.Query.parseAsync(await searchParams);

  return await createMetadata({
    title: await getTitle({ queryParameters: queryParameters }),
  });
}

export default async function EventsPage({
  searchParams,
}: PageInput<Keys.Path, Keys.Query>) {
  await connection();

  const queryParameters = await Schemas.Query.parseAsync(await searchParams);

  return (
    <Authenticated>
      <Metadata title={await getTitle({ queryParameters: queryParameters })} />
      <EventsPageView queryParameters={queryParameters} />
    </Authenticated>
  );
}
