import { msg } from "@lingui/core/macro";
import { Button, Stack, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { useDeepCompareMemo } from "use-deep-compare";

import type { EditShowWidgetInput, EditShowWidgetSaveInput } from "./types";

import { useLocalization } from "../../../../../../isomorphic/localization/hooks/use-localization";
import { useNotifications } from "../../../../../../isomorphic/notifications/hooks/use-notifications";
import { EditShowForm } from "./components/edit-show-form";

export function EditShowWidget({ onBack, onSave, show }: EditShowWidgetInput) {
  const [saving, setSaving] = useState(false);

  const { localization } = useLocalization();
  const { notifications } = useNotifications();

  const initialValues = useDeepCompareMemo(
    () => ({ description: show.description, title: show.title }),
    [show],
  );

  const handleSave = useCallback(
    async (input: EditShowWidgetSaveInput) => {
      if (saving || !onSave) return;

      setSaving(true);

      try {
        return await onSave(input);
      } finally {
        setSaving(false);
      }
    },
    [onSave, saving],
  );

  const handleError = useCallback(() => {
    notifications.error({ message: msg({ message: "Invalid input" }) });
  }, [notifications.error]);

  return (
    <Stack h="100%" w="100%">
      <Title ta="center">
        {localization.localize(msg({ message: "Edit show" }))}
      </Title>
      <EditShowForm
        initialValues={initialValues}
        onError={handleError}
        onSubmit={handleSave}
      />
      <Button
        color="gray"
        disabled={saving}
        onClick={onBack}
        style={{ flexShrink: 0 }}
        variant="light"
      >
        {localization.localize(msg({ message: "Back" }))}
      </Button>
    </Stack>
  );
}
