import {
  Enabled,
  QueryFunction,
  QueryKey,
  useQuery,
} from "@tanstack/react-query";

export const useQueryData = (
  queryKey: QueryKey,
  queryFn: QueryFunction,
  enabled?: Enabled
) => {
  const { data, isPending, refetch, isFetched, isFetching } = useQuery({
    queryKey,
    queryFn,
    enabled,
  });
  return { data, isPending, isFetched, refetch, isFetching };
};
