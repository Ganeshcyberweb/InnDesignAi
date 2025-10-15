"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  RiLogoutCircleLine,
  RiFindReplaceLine,
} from "@remixicon/react";

import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Get user initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.profile?.name || 'User';
  const userEmail = user?.email || '';
  const userAvatar = user?.profile?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-8">
            <AvatarImage
              src={userAvatar || "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/user-02_mlqqqt.png"}
              width={32}
              height={32}
              alt="Profile image"
            />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 p-2" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col py-0 px-1 mb-2">
          <span className="truncate text-sm font-medium text-foreground mb-0.5">
            {userName}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {userEmail}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="gap-3 px-1 cursor-pointer"
          onClick={() => handleNavigation('/dashboard/history')}
        >
          <RiFindReplaceLine
            size={20}
            className="text-muted-foreground/70"
            aria-hidden="true"
          />
          <span>History</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-3 px-1 cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <RiLogoutCircleLine
            size={20}
            className="text-red-500"
            aria-hidden="true"
          />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
