import type { PropsWithChildren } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from '../AppSidebar';
import { Separator } from '@radix-ui/react-separator';

import DynamicBreadcrumb from '../DynamicBreadcrumb';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
              <div className="w-full flex justify-between items-center">
                <DynamicBreadcrumb />
                <ConnectButton />
              </div>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
