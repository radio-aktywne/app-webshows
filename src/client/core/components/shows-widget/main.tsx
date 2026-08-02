"use client";

import { msg } from "@lingui/core/macro";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import type { ShowsWidgetInput, ShowsWidgetState } from "./types";

import { getValidationIssue } from "../../../../common/orpc/lib/get-validation-issue";
import { isOrpcDefinedError } from "../../../../common/orpc/lib/is-orpc-defined-error";
import { useNotifications } from "../../../../isomorphic/notifications/hooks/use-notifications";
import { orpcClientSideQueryClient } from "../../../orpc/vars/clients";
import {
  CreateShowWidget,
  type CreateShowWidgetCreateInput,
} from "./components/create-show-widget";
import { DisplayShowsWidget } from "./components/display-shows-widget";
import {
  EditShowWidget,
  type EditShowWidgetSaveInput,
} from "./components/edit-show-widget";

export function ShowsWidget({ limit, order }: ShowsWidgetInput) {
  const [state, setState] = useState<ShowsWidgetState>({ state: "display" });
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>();

  const { notifications } = useNotifications();

  const showsListInput = useMemo(
    () => ({
      limit: limit,
      offset: (page - 1) * limit,
      order: order,
      where: query
        ? { title: { contains: query, mode: "insensitive" as const } }
        : undefined,
    }),
    [limit, order, page, query],
  );

  const queryClient = useQueryClient();

  const showsListQuery = useSuspenseQuery(
    orpcClientSideQueryClient.core.shows.list.queryOptions({
      input: showsListInput,
    }),
  );

  const showsCreateMutation = useMutation(
    orpcClientSideQueryClient.core.shows.create.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.shows.list.key({
            input: showsListInput,
          }),
        ],
      },
    }),
  );

  const showsUpdateMutation = useMutation(
    orpcClientSideQueryClient.core.shows.update.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.shows.list.key({
            input: showsListInput,
          }),
        ],
      },
    }),
  );

  const showsDeleteMutation = useMutation(
    orpcClientSideQueryClient.core.shows.delete.mutationOptions({
      meta: {
        awaits: [
          orpcClientSideQueryClient.core.shows.list.key({
            input: showsListInput,
          }),
        ],
      },
    }),
  );

  const maxPage = Math.max(1, Math.ceil(showsListQuery.data.count / limit));

  if (page > maxPage) setPage(maxPage);

  const handleDisplayDelete = useCallback(
    async (id: string) => {
      try {
        await showsDeleteMutation.mutateAsync({ id: id });
      } catch (error) {
        if (isOrpcDefinedError(error) && error.code === "NOT_FOUND") {
          notifications.warning({
            message: msg({ message: "Show already deleted" }),
          });
          return;
        }

        notifications.error({
          message: msg({ message: "An unexpected error occurred" }),
        });
        throw error;
      }

      notifications.success({ message: msg({ message: "Show deleted" }) });
    },
    [showsDeleteMutation.mutateAsync, notifications],
  );

  const handleDisplayEdit = useCallback(
    (id: string) => {
      const show = showsListQuery.data.shows.find((show) => show.id === id);
      if (show) setState({ show: show, state: "edit" });
    },
    [showsListQuery.data.shows],
  );

  const handleDisplayPageChange = useCallback(
    (page: number) => {
      const newPage = Math.max(1, Math.min(page, maxPage));

      if (newPage > 1)
        void queryClient.prefetchQuery(
          orpcClientSideQueryClient.core.shows.list.queryOptions({
            input: {
              ...showsListInput,
              offset: (newPage - 2) * limit,
            },
          }),
        );

      if (newPage < maxPage)
        void queryClient.prefetchQuery(
          orpcClientSideQueryClient.core.shows.list.queryOptions({
            input: {
              ...showsListInput,
              offset: newPage * limit,
            },
          }),
        );

      setPage(newPage);
    },
    [limit, maxPage, showsListInput, queryClient],
  );

  const handleDisplayQueryChange = useCallback((query: string) => {
    setQuery(query || undefined);
    setPage(1);
  }, []);

  const handleDisplayCreate = useCallback(() => {
    setState({ state: "create" });
  }, []);

  const handleEditBack = useCallback(() => {
    setState({ state: "display" });
    void showsListQuery.refetch();
  }, [showsListQuery.refetch]);

  const handleEditSave = useCallback(
    async ({ values }: EditShowWidgetSaveInput) => {
      if (state.state !== "edit") return;

      try {
        const show = await showsUpdateMutation.mutateAsync({
          data: {
            description: values.description,
            title: values.title,
          },
          id: state.show.id,
        });

        notifications.success({ message: msg({ message: "Show updated" }) });

        setState({ state: "display" });

        return {
          values: {
            description: show.description,
            title: show.title,
          },
        };
      } catch (error) {
        if (isOrpcDefinedError(error)) {
          if (error.code === "BAD_REQUEST") {
            notifications.error({ message: msg({ message: "Invalid input" }) });

            return {
              errors: {
                description: getValidationIssue({
                  error: error,
                  path: "data.description",
                }).message,
                title: getValidationIssue({ error: error, path: "data.title" })
                  .message,
              },
            };
          }

          if (error.code === "NOT_FOUND") {
            notifications.error({
              message: msg({ message: "Show no longer exists" }),
            });

            setState({ state: "display" });
            return;
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
      }
    },
    [
      showsUpdateMutation.mutateAsync,
      notifications.error,
      notifications.success,
      state,
    ],
  );

  const handleCreateBack = useCallback(() => {
    setState({ state: "display" });
    void showsListQuery.refetch();
  }, [showsListQuery.refetch]);

  const handleCreateCreate = useCallback(
    async ({ values }: CreateShowWidgetCreateInput) => {
      try {
        const show = await showsCreateMutation.mutateAsync({
          data: {
            description: values.description,
            title: values.title,
          },
        });

        notifications.success({ message: msg({ message: "Show created" }) });

        setState({ state: "display" });

        return {
          values: {
            description: show.description,
            title: show.title,
          },
        };
      } catch (error) {
        if (isOrpcDefinedError(error)) {
          if (error.code === "BAD_REQUEST") {
            notifications.error({ message: msg({ message: "Invalid input" }) });

            return {
              errors: {
                description: getValidationIssue({
                  error: error,
                  path: "data.description",
                }).message,
                title: getValidationIssue({ error: error, path: "data.title" })
                  .message,
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
      }
    },
    [
      showsCreateMutation.mutateAsync,
      notifications.error,
      notifications.success,
    ],
  );

  switch (state.state) {
    case "create":
      return (
        <CreateShowWidget
          onBack={handleCreateBack}
          onCreate={handleCreateCreate}
        />
      );
    case "display":
      return (
        <DisplayShowsWidget
          limit={limit}
          onCreate={handleDisplayCreate}
          onDelete={handleDisplayDelete}
          onEdit={handleDisplayEdit}
          onPageChange={handleDisplayPageChange}
          onQueryChange={handleDisplayQueryChange}
          page={page}
          query={query}
          shows={showsListQuery.data.shows}
          total={showsListQuery.data.count}
        />
      );
    case "edit":
      return (
        <EditShowWidget
          onBack={handleEditBack}
          onSave={handleEditSave}
          show={state.show}
        />
      );
  }
}
