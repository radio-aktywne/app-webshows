"use client";

import { msg } from "@lingui/core/macro";

import type {
  ErrorInput,
  ErrorMetadataUtilityInput,
} from "../../../../../types";

import { Metadata } from "../../../../../../isomorphic/metadata/components/metadata";
import { ModalsErrorView } from "./error.view";

function getTitle({}: ErrorMetadataUtilityInput = {}) {
  return msg({ message: "Error • tulip" });
}

export default function ModalsError({ reset }: ErrorInput) {
  return (
    <>
      <Metadata title={getTitle()} />
      <ModalsErrorView reset={reset} />
    </>
  );
}
