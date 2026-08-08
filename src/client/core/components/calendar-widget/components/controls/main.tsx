import { msg } from "@lingui/core/macro";
import { ActionIcon, Group, Text, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import type { ControlsInput } from "./types";

import { useLocalization } from "../../../../../../isomorphic/localization/hooks/use-localization";

export function Controls({ date }: ControlsInput) {
  const start = date.local().startOf("week");
  const end = date.local().endOf("week");

  const { localization } = useLocalization();

  return (
    <Group justify="space-between" w="100%">
      <ActionIcon
        color="inherit"
        component={Link}
        href={{
          pathname: "/",
          query: {
            date: date.subtract(1, "week").format("YYYY-MM-DD"),
          },
        }}
        title={localization.localize(msg({ message: "Previous week" }))}
      >
        <MdKeyboardArrowLeft size="2em" />
      </ActionIcon>
      <UnstyledButton component={Link} href="/">
        <Text fw="bold" size="sm">
          {start.format("LL")} - {end.format("LL")}
        </Text>
      </UnstyledButton>
      <ActionIcon
        color="inherit"
        component={Link}
        href={{
          pathname: "/",
          query: {
            date: date.add(1, "week").format("YYYY-MM-DD"),
          },
        }}
        title={localization.localize(msg({ message: "Next week" }))}
      >
        <MdKeyboardArrowRight size="2em" />
      </ActionIcon>
    </Group>
  );
}
