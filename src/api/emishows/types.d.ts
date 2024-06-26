/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/events": {
    /**
     * List events
     * @description List events that match the request.
     */
    get: operations["EventsList"];
    /**
     * Create event
     * @description Create an event.
     */
    post: operations["EventsCreate"];
  };
  "/events/{id}": {
    /**
     * Get event
     * @description Get an event by ID.
     */
    get: operations["EventsIdGet"];
    /**
     * Delete event
     * @description Delete an event by ID.
     */
    delete: operations["EventsIdDelete"];
    /**
     * Update event
     * @description Update an event by ID.
     */
    patch: operations["EventsIdUpdate"];
  };
  "/ping": {
    /**
     * Ping
     * @description Do nothing.
     */
    get: operations["PingPing"];
  };
  "/schedule": {
    /**
     * List schedules
     * @description List event schedules with instances between two dates.
     */
    get: operations["ScheduleList"];
  };
  "/shows": {
    /**
     * List shows
     * @description List shows that match the request.
     */
    get: operations["ShowsList"];
    /**
     * Create show
     * @description Create a show.
     */
    post: operations["ShowsCreate"];
  };
  "/shows/{id}": {
    /**
     * Get show
     * @description Get a show by ID.
     */
    get: operations["ShowsIdGet"];
    /**
     * Delete show
     * @description Delete a show by ID.
     */
    delete: operations["ShowsIdDelete"];
    /**
     * Update show
     * @description Update a show by ID.
     */
    patch: operations["ShowsIdUpdate"];
  };
  "/sse": {
    /**
     * Get SSE stream
     * @description Get a stream of Server-Sent Events.
     */
    get: operations["SseSubscribe"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /** ListResponse */
    events_models_ListResponse: {
      /**
       * ListResponse.Count
       * @description Number of events that matched the request.
       */
      count: number;
      /**
       * ListResponse.Limit
       * @description Maximum number of returned events.
       */
      limit?: null | number;
      /**
       * ListResponse.Offset
       * @description Number of events skipped.
       */
      offset?: null | number;
      /**
       * ListResponse.Events
       * @description Events that matched the request.
       */
      events: components["schemas"]["emishows_events_models_Event"][];
    };
    /** ListResponse */
    schedule_models_ListResponse: {
      /**
       * ListResponse.Count
       * @description Number of event schedules that matched the request.
       */
      count: number;
      /**
       * ListResponse.Limit
       * @description Maximum number of returned event schedules.
       */
      limit?: null | number;
      /**
       * ListResponse.Offset
       * @description Number of event schedules skipped.
       */
      offset?: null | number;
      /**
       * ListResponse.Schedules
       * @description Event schedules that matched the request.
       */
      schedules: components["schemas"]["EventSchedule"][];
    };
    /** ListResponse */
    shows_models_ListResponse: {
      /**
       * ListResponse.Count
       * @description Number of shows that matched the request.
       */
      count: number;
      /**
       * ListResponse.Limit
       * @description Maximum number of returned shows.
       */
      limit?: null | number;
      /**
       * ListResponse.Offset
       * @description Number of shows skipped.
       */
      offset?: null | number;
      /**
       * ListResponse.Shows
       * @description Shows that matched the request.
       */
      shows: components["schemas"]["Show"][];
    };
    /** Event */
    emishows_events_models_Event: {
      id: string;
      /** @enum {string} */
      type: "live" | "replay" | "prerecorded";
      showId: string;
      show?: null | components["schemas"]["Show"];
      /**
       * Event.Start
       * @description Start time of the event in event timezone.
       */
      start: unknown;
      /**
       * Event.End
       * @description End time of the event in event timezone.
       */
      end: unknown;
      /**
       * Event.Timezone
       * @description Timezone of the event.
       */
      timezone: string;
      /**
       * Event.Recurrence
       * @description Recurrence of the event.
       */
      recurrence?: null | components["schemas"]["Recurrence"];
    };
    /** Event */
    prisma_models_Event: {
      id: string;
      /** @enum {string} */
      type: "live" | "replay" | "prerecorded";
      showId: string;
      show?: null | components["schemas"]["Show"];
    };
    /** Show */
    Show: {
      id: string;
      title: string;
      description?: null | string;
      events?: null | components["schemas"]["prisma_models_Event"][];
    };
    /** Recurrence */
    Recurrence: {
      /**
       * Recurrence.Rule
       * @description Rule of the recurrence.
       */
      rule?: null | components["schemas"]["RecurrenceRule"];
      /**
       * Recurrence.Include
       * @description Included dates of the recurrence in event timezone.
       */
      include?: null | unknown[];
      /**
       * Recurrence.Exclude
       * @description Excluded dates of the recurrence in event timezone.
       */
      exclude?: null | unknown[];
    };
    /** RecurrenceRule */
    RecurrenceRule: {
      /**
       * RecurrenceRule.Frequency
       * @description Frequency of the recurrence.
       * @enum {string}
       */
      frequency:
        | "secondly"
        | "minutely"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly";
      /**
       * RecurrenceRule.Until
       * @description End date of the recurrence in UTC.
       */
      until?: unknown;
      /**
       * RecurrenceRule.Count
       * @description Number of occurrences of the recurrence.
       */
      count?: null | number;
      /**
       * RecurrenceRule.Interval
       * @description Interval of the recurrence.
       */
      interval?: null | number;
      /**
       * RecurrenceRule.BySeconds
       * @description Seconds of the recurrence.
       */
      bySeconds?: null | number[];
      /**
       * RecurrenceRule.ByMinutes
       * @description Minutes of the recurrence.
       */
      byMinutes?: null | number[];
      /**
       * RecurrenceRule.ByHours
       * @description Hours of the recurrence.
       */
      byHours?: null | number[];
      /**
       * RecurrenceRule.ByWeekdays
       * @description Weekdays of the recurrence.
       */
      byWeekdays?: null | components["schemas"]["WeekdayRule"][];
      /**
       * RecurrenceRule.ByMonthdays
       * @description Monthdays of the recurrence.
       */
      byMonthdays?: null | number[];
      /**
       * RecurrenceRule.ByYeardays
       * @description Yeardays of the recurrence.
       */
      byYeardays?: null | number[];
      /**
       * RecurrenceRule.ByWeeks
       * @description Weeks of the recurrence.
       */
      byWeeks?: null | number[];
      /**
       * RecurrenceRule.ByMonths
       * @description Months of the recurrence.
       */
      byMonths?: null | number[];
      /**
       * RecurrenceRule.BySetPositions
       * @description Set positions of the recurrence.
       */
      bySetPositions?: null | number[];
      /**
       * RecurrenceRule.WeekStart
       * @description Start day of the week.
       * @enum {null|string}
       */
      weekStart?:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
        | null;
    };
    /** WeekdayRule */
    WeekdayRule: {
      /**
       * DayRule.Day
       * @description Day of the week.
       * @enum {string}
       */
      day:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday";
      /**
       * DayRule.Occurrence
       * @description Occurrence of the day in the year.
       */
      occurrence?: null | number;
    };
    /** EventCreateInput */
    EventCreateInput: {
      id?: string;
      showId?: string;
      show?: components["schemas"]["ShowCreateNestedWithoutRelationsInput"];
      /** @enum {string} */
      type: "live" | "replay" | "prerecorded";
      start: string;
      end: string;
      timezone: string;
      recurrence?: null | components["schemas"]["Recurrence"];
    };
    /** ShowCreateNestedWithoutRelationsInput */
    ShowCreateNestedWithoutRelationsInput: {
      create?: components["schemas"]["ShowCreateWithoutRelationsInput"];
      connect?: components["schemas"]["_ShowWhereUnique_id_Input"];
    };
    /** ShowCreateWithoutRelationsInput */
    ShowCreateWithoutRelationsInput: {
      id?: string;
      description?: null | string;
      title: string;
    };
    /** _ShowWhereUnique_id_Input */
    _ShowWhereUnique_id_Input: {
      id: string;
    };
    /** EventUpdateInput */
    EventUpdateInput: {
      id?: string;
      /** @enum {string} */
      type?: "live" | "replay" | "prerecorded";
      show?: components["schemas"]["ShowUpdateOneWithoutRelationsInput"];
      start?: string;
      end?: string;
      timezone?: string;
      recurrence?: null | components["schemas"]["Recurrence"];
    };
    /** ShowUpdateOneWithoutRelationsInput */
    ShowUpdateOneWithoutRelationsInput: {
      create?: components["schemas"]["ShowCreateWithoutRelationsInput"];
      connect?: components["schemas"]["_ShowWhereUnique_id_Input"];
      disconnect?: boolean;
      delete?: boolean;
    };
    /** EventSchedule */
    EventSchedule: {
      event: components["schemas"]["emishows_events_models_Event"];
      /**
       * EventSchedule.Instances
       * @description Event instances.
       */
      instances: components["schemas"]["EventInstance"][];
    };
    /** EventInstance */
    EventInstance: {
      /**
       * EventInstance.Start
       * @description Start time of the event instance in event timezone.
       */
      start: unknown;
      /**
       * EventInstance.End
       * @description End time of the event instance in event timezone.
       */
      end: unknown;
    };
    /** ShowCreateInput */
    ShowCreateInput: {
      id?: string;
      description?: null | string;
      events?: components["schemas"]["EventCreateManyNestedWithoutRelationsInput"];
      title: string;
    };
    /** EventCreateManyNestedWithoutRelationsInput */
    EventCreateManyNestedWithoutRelationsInput: {
      create?:
        | components["schemas"]["EventCreateWithoutRelationsInput"]
        | components["schemas"]["EventCreateWithoutRelationsInput"][];
      connect?:
        | components["schemas"]["_EventWhereUnique_id_Input"]
        | components["schemas"]["_EventWhereUnique_id_Input"][];
    };
    /** EventCreateWithoutRelationsInput */
    EventCreateWithoutRelationsInput: {
      id?: string;
      showId?: string;
      /** @enum {string} */
      type: "live" | "replay" | "prerecorded";
    };
    /** _EventWhereUnique_id_Input */
    _EventWhereUnique_id_Input: {
      id: string;
    };
    /** ShowUpdateInput */
    ShowUpdateInput: {
      id?: string;
      title?: string;
      description?: null | string;
      events?: components["schemas"]["EventUpdateManyWithoutRelationsInput"];
    };
    /** EventUpdateManyWithoutRelationsInput */
    EventUpdateManyWithoutRelationsInput: {
      create?: components["schemas"]["EventCreateWithoutRelationsInput"][];
      connect?: components["schemas"]["_EventWhereUnique_id_Input"][];
      set?: components["schemas"]["_EventWhereUnique_id_Input"][];
      disconnect?: components["schemas"]["_EventWhereUnique_id_Input"][];
      delete?: components["schemas"]["_EventWhereUnique_id_Input"][];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {
  /**
   * List events
   * @description List events that match the request.
   */
  EventsList: {
    parameters: {
      query?: {
        /** @description Maximum number of events to return. */
        limit?: null | number;
        /** @description Number of events to skip. */
        offset?: null | number;
        /** @description Filter to apply to events. */
        where?: null | string;
        /** @description Advanced query to apply to events. */
        query?: null | string;
        /** @description Relations to include with events. */
        include?: null | string;
        /** @description Order to apply to events. */
        order?: null | string;
      };
    };
    responses: {
      /** @description Request fulfilled, document follows */
      200: {
        headers: {};
        content: {
          "application/json": components["schemas"]["events_models_ListResponse"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Create event
   * @description Create an event.
   */
  EventsCreate: {
    parameters: {
      query?: {
        /** @description Relations to include with event. */
        include?: null | string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["EventCreateInput"];
      };
    };
    responses: {
      /** @description Document created, URL follows */
      201: {
        headers: {};
        content: {
          "application/json": components["schemas"]["emishows_events_models_Event"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Get event
   * @description Get an event by ID.
   */
  EventsIdGet: {
    parameters: {
      query?: {
        /** @description Relations to include with event. */
        include?: null | string;
      };
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Request fulfilled, document follows */
      200: {
        headers: {};
        content: {
          "application/json": components["schemas"]["emishows_events_models_Event"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Delete event
   * @description Delete an event by ID.
   */
  EventsIdDelete: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Request fulfilled, nothing follows */
      204: {
        headers: {};
        content: {
          "application/json": null;
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Update event
   * @description Update an event by ID.
   */
  EventsIdUpdate: {
    parameters: {
      query?: {
        /** @description Relations to include with event. */
        include?: null | string;
      };
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["EventUpdateInput"];
      };
    };
    responses: {
      /** @description Request fulfilled, document follows */
      200: {
        headers: {};
        content: {
          "application/json": components["schemas"]["emishows_events_models_Event"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Ping
   * @description Do nothing.
   */
  PingPing: {
    responses: {
      /** @description Request fulfilled, nothing follows */
      204: {
        headers: {
          "cache-control"?: string;
        };
        content: {
          "application/json": null;
        };
      };
    };
  };
  /**
   * List schedules
   * @description List event schedules with instances between two dates.
   */
  ScheduleList: {
    parameters: {
      query?: {
        /** @description Start time in UTC of the event instances to return. By default, the current datetime. */
        start?: null | string;
        /** @description End time in UTC of the event instances to return. By default, the current datetime. */
        end?: null | string;
        /** @description Maximum number of events to return. */
        limit?: null | number;
        /** @description Number of events to skip. */
        offset?: null | number;
        /** @description Filter to apply to events. */
        where?: null | string;
        /** @description Relations to include with events. */
        include?: null | string;
        /** @description Order to apply to events. */
        order?: null | string;
      };
    };
    responses: {
      /** @description Request fulfilled, document follows */
      200: {
        headers: {};
        content: {
          "application/json": components["schemas"]["schedule_models_ListResponse"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * List shows
   * @description List shows that match the request.
   */
  ShowsList: {
    parameters: {
      query?: {
        /** @description Maximum number of shows to return. */
        limit?: null | number;
        /** @description Number of shows to skip. */
        offset?: null | number;
        /** @description Filter to apply to shows. */
        where?: null | string;
        /** @description Relations to include with shows. */
        include?: null | string;
        /** @description Order to apply to shows. */
        order?: null | string;
      };
    };
    responses: {
      /** @description Request fulfilled, document follows */
      200: {
        headers: {};
        content: {
          "application/json": components["schemas"]["shows_models_ListResponse"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Create show
   * @description Create a show.
   */
  ShowsCreate: {
    parameters: {
      query?: {
        /** @description Relations to include with show. */
        include?: null | string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ShowCreateInput"];
      };
    };
    responses: {
      /** @description Document created, URL follows */
      201: {
        headers: {};
        content: {
          "application/json": components["schemas"]["Show"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Get show
   * @description Get a show by ID.
   */
  ShowsIdGet: {
    parameters: {
      query?: {
        /** @description Relations to include with show. */
        include?: null | string;
      };
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Request fulfilled, document follows */
      200: {
        headers: {};
        content: {
          "application/json": components["schemas"]["Show"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Delete show
   * @description Delete a show by ID.
   */
  ShowsIdDelete: {
    parameters: {
      path: {
        id: string;
      };
    };
    responses: {
      /** @description Request fulfilled, nothing follows */
      204: {
        headers: {};
        content: {
          "application/json": null;
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Update show
   * @description Update a show by ID.
   */
  ShowsIdUpdate: {
    parameters: {
      query?: {
        /** @description Relations to include with show. */
        include?: null | string;
      };
      path: {
        id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ShowUpdateInput"];
      };
    };
    responses: {
      /** @description Request fulfilled, document follows */
      200: {
        headers: {};
        content: {
          "application/json": components["schemas"]["Show"];
        };
      };
      /** @description Bad request syntax or unsupported method */
      400: {
        content: {
          "application/json": {
            status_code: number;
            detail: string;
            extra?:
              | null
              | {
                  [key: string]: unknown;
                }
              | unknown[];
          };
        };
      };
    };
  };
  /**
   * Get SSE stream
   * @description Get a stream of Server-Sent Events.
   */
  SseSubscribe: {
    responses: {
      /** @description Request fulfilled, document follows */
      200: {
        headers: {
          /** @description File size in bytes */
          "content-length"?: string;
          /** @description Last modified data-time in RFC 2822 format */
          "last-modified"?: string;
          /** @description Entity tag */
          etag?: string;
        };
        content: {
          "": string;
        };
      };
    };
  };
}
