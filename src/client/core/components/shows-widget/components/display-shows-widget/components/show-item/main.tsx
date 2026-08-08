import { msg } from "@lingui/core/macro";
import { ActionIcon, Group, Text, UnstyledButton } from "@mantine/core";
import { ListItem } from "@radio-aktywne/ui";
import { useCallback, useState } from "react";
import { MdDelete } from "react-icons/md";

import type { ShowItemInput } from "./types";

import { useLocalization } from "../../../../../../../../isomorphic/localization/hooks/use-localization";

export function ShowItem({ onDelete, onEdit, show }: ShowItemInput) {
  const [deleting, setDeleting] = useState(false);

  const { localization } = useLocalization();

  const handleDelete = useCallback(async () => {
    if (deleting || !onDelete) return;

    setDeleting(true);

    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  }, [deleting, onDelete]);

  return (
    <ListItem>
      <Group gap="xs">
        <UnstyledButton onClick={onEdit}>
          <Text fw="bold" size="xs">
            {show.title}
          </Text>
        </UnstyledButton>
      </Group>
      <ActionIcon
        bd="none"
        color="ra-red"
        disabled={deleting}
        onClick={handleDelete}
        size="auto"
        title={localization.localize(msg({ message: "Delete" }))}
      >
        <MdDelete size="1em" />
      </ActionIcon>
    </ListItem>
  );
}
