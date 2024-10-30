import { createFolder } from "@/actions/workspace";
import { useMutationData } from "@/hooks/useMutationData";

export const useCreateFolders = ({ workspaceId }: { workspaceId: string }) => {
  const { mutate, isPending } = useMutationData(
    ["create-folder"],
    () => createFolder(workspaceId),
    ["workspace-folders"]
  );
};
