'use client';

import { Frame, Map as MapIcon, PieChart } from 'lucide-react';
import type * as React from 'react';

import { NavProjects } from '@/components/NavProjects';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const ITEMS = {
  pages: [
    {
      name: 'Models',
      url: '/models',
      icon: Frame,
    },
    {
      name: 'Bounties',
      url: '/bounties',
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>LOGO</SidebarHeader>
      <SidebarContent>
        <NavProjects projects={ITEMS.pages} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
