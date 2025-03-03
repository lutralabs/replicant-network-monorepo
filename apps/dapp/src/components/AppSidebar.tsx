'use client';

import { Frame, Map as MapIcon, PieChart } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';

import Logo from '../../public/RN_logo.svg?url';
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
      <SidebarHeader className="group-data-[collapsible=icon]:p-2">
        <Image height={64} width={48} src={Logo} alt="RN Logo" />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={ITEMS.pages} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
