'use client';

import { Frame, Map as MapIcon, PieChart } from 'lucide-react';
import { SiDiscord, SiGithub, SiX } from '@icons-pack/react-simple-icons';
import Image from 'next/image';
import type * as React from 'react';

import Logo from '../../public/RN_logo.svg?url';
import { NavProjects } from '@/components/NavProjects';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavSocial } from './NavSocial';

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

const SOCIAL = {
  pages: [
    {
      name: 'Discord',
      url: 'https://discord.gg/jj9K9UJwa7',
      icon: SiDiscord,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/lutralabs',
      icon: SiGithub,
    },
    // {
    //   name: 'X',
    //   url: '',
    //   icon: SiX,
    // },
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
      <SidebarFooter>
        <NavSocial socials={SOCIAL.pages} />
      </SidebarFooter>
    </Sidebar>
  );
}
