'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export function AvatarUser() {
  return (
    <div className="flex items-center gap-4 sm:gap-12 mr-2 sm:mr-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer w-8 h-8 sm:size-10">
            <AvatarImage src="/images/avatar/avatar-4.jpg" alt="Dilshod" />
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        {/* Mobil uchun to‘liq kenglik, desktop uchun normal */}
        <DropdownMenuContent
          className="w-screen sm:w-56 sm:mr-6 p-4 sm:p-2"
          align="end"
          sideOffset={4}>
          {/* User info */}
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold">Dilshod</span>
              <span className="text-sm text-muted-foreground">
                dilshod@gmail.com
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Menu items */}
          <DropdownMenuItem>
            <Link href="/" className="w-full block">
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/account/profile" className="w-full block">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/account/settings" className="w-full block">
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button className="w-full text-red-500 flex items-center font-bold py-2">
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              Chiqish
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
