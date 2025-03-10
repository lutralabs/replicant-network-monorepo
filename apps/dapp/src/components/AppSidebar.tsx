'use client';

import { SiDiscord, SiGithub, SiX } from '@icons-pack/react-simple-icons';
import { Frame, PieChart } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';

import { NavProjects } from '@/components/NavProjects';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import Logo from '../../public/RN_logo.svg?url';
import { NavSocial } from './NavSocial';

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
    {
      name: 'X',
      url: 'https://x.com/rplcnt_io',
      icon: SiX,
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
      <SidebarFooter>
        <NavSocial socials={SOCIAL.pages} />
      </SidebarFooter>
    </Sidebar>
  );
}
