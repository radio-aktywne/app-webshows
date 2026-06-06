import { msg } from "@lingui/core/macro";
import { connection } from "next/server";

import type {
  NotFoundInput,
  NotFoundMetadataInput,
  NotFoundMetadataUtilityInput,
} from "../../../../../../types";

import { Metadata } from "../../../../../../../isomorphic/metadata/components/metadata";
import { createMetadata } from "../../../../../../../server/metadata/lib/create-metadata";
import { EventsIdNotFoundView } from "./not-found.view";

async function getTitle({}: NotFoundMetadataUtilityInput = {}) {
  return msg({ message: "Event not found • tulip" });
}

export async function generateMetadata({}: NotFoundMetadataInput) {
  return await createMetadata({
    title: await getTitle(),
  });
}

export default async function EventsIdNotFound({}: NotFoundInput) {
  await connection();

  return (
    <>
      <Metadata title={await getTitle()} />
      <EventsIdNotFoundView />
    </>
  );
}
