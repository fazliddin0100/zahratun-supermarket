'use client';

import React, { useState } from 'react';
import {
  Bell,
  Menu,
  Search,
  CheckCheck,
  LogOut,
  User,
  Home,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      {/* ================= TOP BAR ================= */}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop Search */}
          <div className="relative w-full max-w-sm hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Qidiruv..."
              className="pl-9 bg-muted/50 focus-visible:ring-green-500"
            />
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSearchOpen((prev) => !prev)}>
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white p-0 text-[10px] flex items-center justify-center">
                  2
                </Badge>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h5 className="text-sm font-semibold">Bildirishnomalar</h5>
                  <p className="text-xs text-muted-foreground">
                    Sizda 2 ta xabar bor
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600">
                  <CheckCheck className="h-4 w-4" />
                </Button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                <NotificationItem
                  avatar="/images/avatar-1.jpg"
                  title="Buyurtma"
                  desc="qabul qilindi"
                  time="1 daqiqa oldin"
                />
                <NotificationItem
                  avatar="/images/avatar-5.jpg"
                  title="Jitu"
                  desc="javob berdi"
                  time="2 kun oldin"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/images/avatar-1.jpg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal text-xs">
                <p className="font-medium">Zahratun Admin</p>
                <p className="text-muted-foreground">admin@zahratun.uz</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Home className="mr-2 h-4 w-4" />
                Bosh sahifa
              </DropdownMenuItem>

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Chiqish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ================= MOBILE SEARCH INPUT ================= */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 border-t bg-background">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Qidiruv..."
              autoFocus
              className="pl-9 bg-muted/50 focus-visible:ring-green-500"
            />
          </div>
        </div>
      )}
    </header>
  );
}

/* ================= NOTIFICATION ITEM ================= */

interface NotificationItemProps {
  avatar: string;
  title: string;
  desc: string;
  time: string;
}

function NotificationItem({
  avatar,
  title,
  desc,
  time,
}: NotificationItemProps) {
  return (
    <div className="flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <p className="text-xs">
          <span className="font-semibold">{title}</span> {desc}
        </p>
        <p className="text-[10px] text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
