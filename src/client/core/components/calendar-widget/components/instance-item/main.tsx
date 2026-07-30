import { msg } from "@lingui/core/macro";
import { Text, UnstyledButton } from "@mantine/core";
import { CalendarItem } from "@radio-aktywne/ui";
import Link from "next/link";

import type { InstanceItemInput } from "./types";

import { dayjs } from "../../../../../../common/dates/vars/dayjs";
import { useLocalization } from "../../../../../../isomorphic/localization/hooks/use-localization";
import { constants } from "./constants";

export function InstanceItem({ instance, ...input }: InstanceItemInput) {
  const { localization } = useLocalization();

  return (
    <UnstyledButton
      component={Link}
      display="contents"
      href={`/events/${instance.event.id}`}
    >
      <CalendarItem
        color={constants.colors[instance.event.type]}
        end={dayjs
          .tz(instance.start, instance.event.timezone)
          .add(dayjs.duration(instance.duration))}
        start={dayjs.tz(instance.start, instance.event.timezone)}
        {...input}
      >
        <Text fw="bold" size="xs" ta="center" truncate="end" w="100%">
          {instance.event.show?.title ??
            localization.localize(msg({ message: "No show" }))}
        </Text>
      </CalendarItem>
    </UnstyledButton>
  );
}
