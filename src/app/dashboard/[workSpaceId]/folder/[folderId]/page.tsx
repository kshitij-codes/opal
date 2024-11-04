import { getAllUserVideos, getFolderInfo } from "@/actions/workspace";
import FolderInfo from "@/components/global/folders/folder-info";
import Videos from "@/components/global/videos";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

type Props = {
  params: {
    folderId: string;
    workSpaceId: string;
  };
};

const page = async ({ params: { folderId, workSpaceId } }: Props) => {
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["folder-videos"],
    queryFn: () => getAllUserVideos(workSpaceId),
  });

  await query.prefetchQuery({
    queryKey: ["folder-info"],
    queryFn: () => getFolderInfo(folderId),
  });
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <FolderInfo folderId={folderId} />
      <Videos
        folderId={folderId}
        videosKey="folder-videos"
        workspaceId={workSpaceId}
      />
    </HydrationBoundary>
  );
};
export default page;
