"use client";

import { msg } from "@lingui/core/macro";

import type { ErrorInput, ErrorMetadataUtilityInput } from "../../../../types";

import { Metadata } from "../../../../../isomorphic/metadata/components/metadata";
import { CoreDetailErrorView } from "./error.view";

function getTitle({}: ErrorMetadataUtilityInput = {}) {
  return msg({ message: "Error • tulip" });
}

export default function CoreDetailError({ reset }: ErrorInput) {
  return (
    <>
      <Metadata title={getTitle()} />
      <CoreDetailErrorView reset={reset} />
    </>
  );
}
