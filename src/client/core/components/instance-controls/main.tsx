"use client";

import { msg } from "@lingui/core/macro";
import { ActionIcon, Group } from "@mantine/core";
import { MdCallSplit, MdEventRepeat } from "react-icons/md";

import type { InstanceControlsInput } from "./types";

import { HistoryLink } from "../../../../isomorphic/generic/components/history-link";
import { useLocalization } from "../../../../isomorphic/localization/hooks/use-localization";

export function InstanceControls({ event, start }: InstanceControlsInput) {
  const { localization } = useLocalization();

  return (
    <Group>
      <ActionIcon
        actions={[{ type: "pop" }]}
        color="dark.1"
        component={HistoryLink}
        href={`/events/${event}/split?at=${encodeURIComponent(start)}`}
        title={localization.localize(msg({ message: "Split event" }))}
        variant="subtle"
      >
        <MdCallSplit />
      </ActionIcon>
      <ActionIcon
        actions={[{ type: "pop" }]}
        color="dark.1"
        component={HistoryLink}
        href={`/events/${event}`}
        title={localization.localize(msg({ message: "Edit event" }))}
        variant="subtle"
      >
        <MdEventRepeat />
      </ActionIcon>
    </Group>
  );
}
