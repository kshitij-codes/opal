"use client";

import React from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkSpaces } from "@/actions/workspace";
import { WorkspaceProps } from "@/types/index.type";
import Modal from "../modal";
import { Button } from "@/components/ui/button";
import { Link, PlusCircle } from "lucide-react";
import Search from "../search";
import { MENU_ITEMS } from "@/constants";
type Props = {
  activeWorkSpaceId: string;
};

const Sidebar = ({ activeWorkSpaceId }: Props) => {
  const router = useRouter();
  const { data, isFetched } = useQueryData(["user-workspaces"], () =>
    getWorkSpaces(activeWorkSpaceId)
  );
  const menuItems = MENU_ITEMS(activeWorkSpaceId);
  const { data: workspace } = data as WorkspaceProps;
  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  const currentWorkspace = workspace?.workspace?.find(
    (item) => item.id === activeWorkSpaceId
  );

  return (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center mb-4 absolute top-0 left-0 right-0">
      <Image src="/opal-logo.svg" alt="logo" width={40} height={40} />
      <p className="text-2xl font-bold text-white">Opal</p>
      <Select
        defaultValue={activeWorkSpaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select workspace" />
        </SelectTrigger>
        <SelectContent className="bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspace.workspace.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
            {workspace.members.length > 0 &&
              workspace.members.map((member) => (
                <SelectItem
                  key={member.WorkSpace.id}
                  value={member.WorkSpace.id}
                >
                  {member.WorkSpace.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currentWorkspace?.type === "PUBLIC" &&
        workspace.subscription?.plan === "PRO" && (
          <Modal
            trigger={
              <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90  hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
                <PlusCircle
                  size={15}
                  className="text-neutral-800/90 fill-neutral-500"
                />
                <span className="text-neutral-400 font-semibold text-xs">
                  Invite To Workspace
                </span>
              </span>
            }
            title="Invite To Workspace"
            description="Invite other users to your workspace"
          >
            <Search workspaceId={activeWorkSpaceId} />
          </Modal>
        )}
      <p className="w-full font-bold mt-4 text-[#9d9d9d]">Menu</p>
      <nav className="w-full">
        {/* {menuItems.map((item) => (
          <Link
        ))} */}
      </nav>
    </div>
  );
};

export default Sidebar;
