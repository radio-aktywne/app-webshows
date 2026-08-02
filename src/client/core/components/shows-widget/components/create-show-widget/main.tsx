import { msg } from "@lingui/core/macro";
import { Button, Stack, Title } from "@mantine/core";
import { useCallback, useState } from "react";

import type {
  CreateShowWidgetCreateInput,
  CreateShowWidgetInput,
} from "./types";

import { useLocalization } from "../../../../../../isomorphic/localization/hooks/use-localization";
import { useNotifications } from "../../../../../../isomorphic/notifications/hooks/use-notifications";
import { CreateShowForm } from "./components/create-show-form";

export function CreateShowWidget({ onBack, onCreate }: CreateShowWidgetInput) {
  const [creating, setCreating] = useState(false);

  const { localization } = useLocalization();
  const { notifications } = useNotifications();

  const handleCreate = useCallback(
    async (input: CreateShowWidgetCreateInput) => {
      if (creating || !onCreate) return;

      setCreating(true);

      try {
        return await onCreate(input);
      } finally {
        setCreating(false);
      }
    },
    [onCreate, creating],
  );

  const handleError = useCallback(() => {
    notifications.error({ message: msg({ message: "Invalid input" }) });
  }, [notifications.error]);

  return (
    <Stack h="100%" w="100%">
      <Title ta="center">
        {localization.localize(msg({ message: "Create show" }))}
      </Title>
      <CreateShowForm onError={handleError} onSubmit={handleCreate} />
      <Button
        color="gray"
        disabled={creating}
        onClick={onBack}
        style={{ flexShrink: 0 }}
        variant="light"
      >
        {localization.localize(msg({ message: "Back" }))}
      </Button>
    </Stack>
  );
}
