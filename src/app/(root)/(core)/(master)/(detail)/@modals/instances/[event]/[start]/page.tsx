import { msg } from "@lingui/core/macro";
import { connection } from "next/server";

import type {
  PageInput,
  PageMetadataInput,
  PageMetadataUtilityInput,
} from "../../../../../../../../types";
import type { Keys } from "./types";

import { Metadata } from "../../../../../../../../../isomorphic/metadata/components/metadata";
import { Authenticated } from "../../../../../../../../../server/access/components/authenticated";
import { createMetadata } from "../../../../../../../../../server/metadata/lib/create-metadata";
import { ModalsInstancesEventStartPageView } from "./page.view";
import { Schemas } from "./schemas";

async function getTitle({}: PageMetadataUtilityInput<
  typeof Schemas.Path,
  typeof Schemas.Query
>) {
  return msg({ message: "Edit instance • tulip" });
}

export async function generateMetadata({
  params,
}: PageMetadataInput<Keys.Path, Keys.Query>) {
  const pathParameters = await Schemas.Path.parseAsync(await params);

  return await createMetadata({
    title: await getTitle({ pathParameters: pathParameters }),
  });
}

export default async function ModalsInstancesEventStartPage({
  params,
}: PageInput<Keys.Path, Keys.Query>) {
  await connection();

  const pathParameters = await Schemas.Path.parseAsync(await params);

  return (
    <Authenticated>
      <Metadata title={await getTitle({ pathParameters: pathParameters })} />
      <ModalsInstancesEventStartPageView pathParameters={pathParameters} />
    </Authenticated>
  );
}
