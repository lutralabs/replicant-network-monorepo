'use client';
import { Separator } from '@radix-ui/react-separator';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { PropsWithChildren } from 'react';

import { AppSidebar } from '../AppSidebar';
import DynamicBreadcrumb from '../DynamicBreadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';

import { LoginButton } from './LoginButton';

export const CoreLayout = ({ children }) => {
  return (
    <div className="relative h-full min-h-full">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                className="mr-2 data-[orientation=vertical]:h-4"
                orientation="vertical"
              />
              <div className="flex w-full items-center justify-between">
                <DynamicBreadcrumb />
                <LoginButton />
              </div>
            </div>
          </header>
          <div className="mt-12 px-16">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
