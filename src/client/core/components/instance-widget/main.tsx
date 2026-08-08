"use client";

import type { SetNonNullableDeep } from "type-fest";

import { msg } from "@lingui/core/macro";
import { Button, Stack } from "@mantine/core";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDeepCompareMemo } from "use-deep-compare";

import type { InstanceWidgetInput } from "./types";

import { createUrl } from "../../../../common/generic/lib/create-url";
import { getValidationIssue } from "../../../../common/orpc/lib/get-validation-issue";
import { isOrpcDefinedError } from "../../../../common/orpc/lib/is-orpc-defined-error";
import { useHistory } from "../../../../isomorphic/generic/hooks/use-history";
import { useLocalization } from "../../../../isomorphic/localization/hooks/use-localization";
import { useNotifications } from "../../../../isomorphic/notifications/hooks/use-notifications";
import { orpcClientSideQueryClient } from "../../../orpc/vars/clients";
import {
  EditInstanceForm,
  type EditInstanceFormSubmitInput,
} from "./components/edit-instance-form";

export function InstanceWidget({ event, start }: InstanceWidgetInput) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  const { history } = useHistory();
  const { localization } = useLocalization();
  const { notifications } = useNotifications();

  const instancesGetQuery = useSuspenseQuery(
    orpcClientSideQueryClient.core.instances.get.queryOptions({
      input: {
        eventId: event,
        include: { event: { include: { show: true } } },
        start: start,
      },
    }),
  );

  const instancesUpdateMutation = useMutation(
    orpcClientSideQueryClient.core.instances.update.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.instances.list.key(),
          orpcClientSideQueryClient.core.instances.get.key(),
          orpcClientSideQueryClient.core.events.list.key(),
          orpcClientSideQueryClient.core.events.get.key(),
        ],
      },
    }),
  );

  const instancesDeleteMutation = useMutation(
    orpcClientSideQueryClient.core.instances.delete.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.instances.list.key(),
          orpcClientSideQueryClient.core.events.list.key(),
        ],
      },
    }),
  );

  const instance = instancesGetQuery.data as SetNonNullableDeep<
    typeof instancesGetQuery.data,
    "event"
  >;

  const handleSave = useCallback(
    async ({ values }: EditInstanceFormSubmitInput) => {
      if (saving || deleting) return;

      setSaving(true);

      try {
        const updatedInstance = await instancesUpdateMutation.mutateAsync({
          data: { start: values.start },
          eventId: instance.eventId,
          include: { event: true },
          start: instance.start,
        });

        notifications.success({
          message: msg({ message: "Instance updated" }),
        });

        if (history.entries.length > 1) {
          const target = history.entries[history.entries.length - 2]!;
          const { url } = createUrl({ path: target.path, query: target.query });
          router.push(url);
        } else {
          router.push("/");
        }

        return { values: { start: updatedInstance.start } };
      } catch (error) {
        if (isOrpcDefinedError(error)) {
          if (error.code === "BAD_REQUEST") {
            notifications.error({ message: msg({ message: "Invalid input" }) });

            return {
              errors: {
                start: getValidationIssue({
                  error: error,
                  path: "data.start",
                }).message,
              },
            };
          }

          if (error.code === "CONFLICT") {
            notifications.error({
              message: msg({ message: "Conflicting input" }),
            });

            return;
          }
        }

        notifications.error({
          message: msg({ message: "An unexpected error occurred" }),
        });

        throw error;
      } finally {
        setSaving(false);
      }
    },
    [
      deleting,
      history.entries.length,
      instance,
      instancesUpdateMutation.mutateAsync,
      notifications.error,
      notifications.success,
      router,
      saving,
    ],
  );

  const handleError = useCallback(() => {
    notifications.error({ message: msg({ message: "Invalid input" }) });
  }, [notifications.error]);

  const handleDelete = useCallback(async () => {
    if (saving || deleting) return;

    setDeleting(true);

    try {
      await instancesDeleteMutation.mutateAsync({
        eventId: instance.eventId,
        start: instance.start,
      });
    } catch (error) {
      if (isOrpcDefinedError(error) && error.code === "NOT_FOUND") {
        notifications.warning({
          message: msg({ message: "Instance already deleted" }),
        });

        if (history.entries.length > 1) {
          const target = history.entries[history.entries.length - 2]!;
          const { url } = createUrl({ path: target.path, query: target.query });
          router.push(url);
        } else {
          router.push("/");
        }

        return;
      }

      notifications.error({
        message: msg({ message: "An unexpected error occurred" }),
      });

      throw error;
    } finally {
      setDeleting(false);
    }

    notifications.success({ message: msg({ message: "Instance deleted" }) });

    if (history.entries.length > 1) {
      const target = history.entries[history.entries.length - 2]!;
      const { url } = createUrl({ path: target.path, query: target.query });
      router.push(url);
    } else {
      router.push("/");
    }
  }, [
    deleting,
    instance,
    instancesDeleteMutation.mutateAsync,
    history.entries.length,
    notifications.success,
    notifications.warning,
    router,
    saving,
  ]);

  const initialValues = useDeepCompareMemo(
    () => ({ start: instance.start }),
    [instance],
  );

  return (
    <Stack h="100%" w="100%">
      <EditInstanceForm
        disabled={deleting}
        initialValues={initialValues}
        instance={instance}
        onError={handleError}
        onSubmit={handleSave}
      />
      <Button
        color="ra-red"
        disabled={saving}
        loading={deleting}
        onClick={handleDelete}
        style={{ flexShrink: 0 }}
      >
        {localization.localize(msg({ message: "Delete" }))}
      </Button>
    </Stack>
  );
}
