import {
  MutationFunction,
  MutationKey,
  QueryKey,
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<any, any>,
  queryKey?: QueryKey,
  onSuccess?: () => void
) => {
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess: (data) => {
      if (onSuccess) onSuccess();
      return toast(data?.success ? "Success" : "Error", {
        description: data?.data,
      });
    },
    onSettled: async () => {
      return await client.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return { mutate, isPending };
};

export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      };
    },
  });
  const latestVariables = data[data.length - 1];
  return { latestVariables };
};

const latestVariables = (data: any) => {
  return data[data.length - 1];
};
