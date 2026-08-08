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
import { ModalsEventsIdSplitPageView } from "./page.view";
import { Schemas } from "./schemas";

async function getTitle({}: PageMetadataUtilityInput<
  typeof Schemas.Path,
  typeof Schemas.Query
>) {
  return msg({ message: "Split event • tulip" });
}

export async function generateMetadata({
  params,
  searchParams,
}: PageMetadataInput<Keys.Path, Keys.Query>) {
  const pathParameters = await Schemas.Path.parseAsync(await params);
  const queryParameters = await Schemas.Query.parseAsync(await searchParams);

  return await createMetadata({
    title: await getTitle({
      pathParameters: pathParameters,
      queryParameters: queryParameters,
    }),
  });
}

export default async function ModalsEventsIdSplitPage({
  params,
  searchParams,
}: PageInput<Keys.Path, Keys.Query>) {
  await connection();

  const pathParameters = await Schemas.Path.parseAsync(await params);
  const queryParameters = await Schemas.Query.parseAsync(await searchParams);

  return (
    <Authenticated>
      <Metadata
        title={await getTitle({
          pathParameters: pathParameters,
          queryParameters: queryParameters,
        })}
      />
      <ModalsEventsIdSplitPageView
        pathParameters={pathParameters}
        queryParameters={queryParameters}
      />
    </Authenticated>
  );
}
