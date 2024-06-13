export type GetShowsProps = {
  limit?: number;
  offset?: number;
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  order?: Record<string, unknown>;
};
