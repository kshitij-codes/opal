import React from "react";
import { getNotifications, onAuthenticateUser } from "../../../actions/user";
import { redirect } from "next/navigation";
import {
  getAllUserVideos,
  getWorkspaceFolders,
  getWorkSpaces,
  verifyAccessToWorkspace,
} from "../../../actions/workspace";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Sidebar from "../../../components/global/sidebar";

type Props = {
  params: {
    workSpaceId: string;
  };
  children: React.ReactNode;
};

const Layout = async ({ params: { workSpaceId }, children }: Props) => {
  const auth = await onAuthenticateUser();
  if (!auth.user?.workspace) {
    redirect("/auth/sign-in");
  }
  if (!auth.user?.workspace.length) {
    redirect("/auth/sign-in");
  }
  const hasAccess = await verifyAccessToWorkspace(workSpaceId);
  console.log("==================", hasAccess);
  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }
  if (!hasAccess.data?.workspace) {
    return null;
  }
  const query = new QueryClient();
  await query.prefetchQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workSpaceId),
  });
  await query.prefetchQuery({
    queryKey: ["user-videos"],
    queryFn: () => getAllUserVideos(workSpaceId),
  });
  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkSpaces(workSpaceId),
  });
  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkSpaceId={workSpaceId} />
        <div className="mt-4">{children}</div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;
