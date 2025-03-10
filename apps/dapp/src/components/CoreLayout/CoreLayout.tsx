'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  SidebarBody,
  SidebarInset,
  SidebarLink,
} from '@/components/ui/sidebar';
import { Cpu, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import { LoginButton } from '@/components/CoreLayout/LoginButton';
import { Separator } from '@/components/ui/separator';
import Logo from '../../../public/RN_logo.svg?url';
import { SiDiscord, SiGithub, SiX } from '@icons-pack/react-simple-icons';

const LINKS = [
  {
    label: 'Models',
    href: '/models',
    icon: (
      <Cpu className="dark:text-neutral-700 text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: 'Bounties',
    href: '/bounties',
    icon: (
      <Award className="dark:text-neutral-700 text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

const SOCIAL = [
  {
    label: 'Discord',
    href: 'https://discord.gg/jj9K9UJwa7',
    icon: (
      <SiDiscord className="dark:text-neutral-700 text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/lutralabs',
    icon: (
      <SiGithub className="dark:text-neutral-700 text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/rplcnt_io',
    icon: (
      <SiX className="dark:text-neutral-700 text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

export const CoreLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row bg-neutral-800 dark:bg-gray-100 flex-1 w-screen mx-auto border border-neutral-700 dark:border-neutral-200 overflow-hidden',
        'h-screen'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 overflow-y-auto md:overflow-visible">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <LogoIcon />
            <div className="mt-8 flex flex-col">
              {LINKS.map((link) => (
                <SidebarLink key={link.label} link={link} />
              ))}
            </div>
          </div>
          <div>
            {SOCIAL.map((link) => (
              <SidebarLink key={link.label} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
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
        <div className="mt-12 px-16 h-full">{children}</div>
      </SidebarInset>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <Image height={64} width={48} src={Logo} alt="RN Logo" />
    </Link>
  );
};
