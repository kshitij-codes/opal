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
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkSpaces } from "@/actions/workspace";
import {
  NotificationCountProps,
  NotificationProps,
  WorkspaceProps,
} from "@/types/index.type";
import Modal from "../modal";
import { Button } from "@/components/ui/button";
import { Link, Menu, PlusCircle } from "lucide-react";
import Search from "../search";
import { MENU_ITEMS } from "@/constants";
import SidebarItem from "./SidebarItem";
import { getNotifications } from "@/actions/user";
import WorkspacePlaceholder from "./WorkspacePlaceholder";
import GlobalCard from "../global-card";
import Loader from "../loader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "../info-bar";
type Props = {
  activeWorkSpaceId: string;
};

const Sidebar = ({ activeWorkSpaceId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isFetched } = useQueryData(["user-workspaces"], () =>
    getWorkSpaces(activeWorkSpaceId)
  );
  const menuItems = MENU_ITEMS(activeWorkSpaceId);
  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );
  const { data: workspace } = data as WorkspaceProps;
  const { data: count } = notifications as NotificationCountProps;
  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  const currentWorkspace = workspace?.workspace?.find(
    (item) => item.id === activeWorkSpaceId
  );

  const SidebarSection = (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-[#111111] relative p-4 h-full w-[250px] gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image src="/opal-logo.svg" alt="logo" width={40} height={40} />
        <p className="text-2xl font-bold text-white">Opal</p>
      </div>
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
            {workspace.workspace?.map((workspace) => (
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
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              href={item.href}
              icon={item.icon}
              title={item.title}
              selected={pathname === item.href}
              notifications={
                (item.title === "Notifications" &&
                  count._count &&
                  count._count.notification) ||
                0
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full font-bold mt-4 text-[#9d9d9d]">Workspaces</p>

      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {workspace.subscription?.plan === "FREE"
              ? "Upgrade to create workspaces"
              : "No Workspaces"}
          </p>
        </div>
      )}

      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map(
              (item) =>
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathname === `/dashboard/${item.id}`}
                    title={item.name}
                    notifications={0}
                    key={item.name}
                    icon={
                      <WorkspacePlaceholder>
                        {item.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                )
            )}
          {workspace.members.length > 0 &&
            workspace.members.map((item) => (
              <SidebarItem
                href={`/dashboard/${item.WorkSpace.id}`}
                selected={pathname === `/dashboard/${item.WorkSpace.id}`}
                title={item.WorkSpace.name}
                notifications={0}
                key={item.WorkSpace.name}
                icon={
                  <WorkspacePlaceholder>
                    {item.WorkSpace.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
              />
            ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      {workspace.subscription?.plan === "FREE" && (
        <GlobalCard
          title="Upgrade to Pro"
          description=" Unlock AI features like transcription, AI summary, and more."
          footer={
            <Button className="text-sm w-full">
              <Loader color="white" state={false}>
                Upgrade
              </Loader>
            </Button>
          }
        >
          <></>
        </GlobalCard>
      )}
    </div>
  );
  return (
    <div className="full">
      <InfoBar />
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant="ghost" className="mt-[2px]">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};

export default Sidebar;
