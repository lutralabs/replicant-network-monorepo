'use client';

import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import { LoginButton } from '@/components/LoginButton';
import {
  Sidebar,
  SidebarBody,
  SidebarInset,
  SidebarLink,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import HomeProviders from '@/providers/HomeProviders';
import { SiDiscord, SiGithub, SiX } from '@icons-pack/react-simple-icons';
import { House, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Logo from '../../../public/RN_logo.svg?url';

const LINKS = [
  {
    label: 'Home',
    href: '/home',
    icon: (
      <House className="dark:text-neutral-700 text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: 'Use Models',
    href: '/models',
    icon: (
      <ImageIcon className="dark:text-neutral-700 text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  },
  {
    label: 'Bounties',
    href: '/bounties',
    icon: (
      <LayoutGrid className="dark:text-neutral-700 text-neutral-200 h-6 w-6 flex-shrink-0" />
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

export default function HomeLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <HomeProviders>
      <div className="flex flex-col md:flex-row bg-neutral-800 dark:bg-gray-100 flex-1 min-w-screen min-h-screen mx-auto dark:border-neutral-200 overflow-x-hidden">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between sticky top-0 gap-10 overflow-y-auto md:overflow-visible">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <LogoIcon />
              <div className="mt-8 flex flex-col">
                {LINKS.map((link) => (
                  <SidebarLink key={link.label} link={link} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {SOCIAL.map((link) => (
                <SidebarLink key={link.label} link={link} />
              ))}
              <div className="md:hidden mt-2 pl-2">
                <LoginButton />
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center gap-2 px-4">
              <div className="flex w-full items-center justify-between pl-4">
                <DynamicBreadcrumb />
                <div className="md:block hidden">
                  <LoginButton />
                </div>
              </div>
            </div>
          </header>
          <div className="pt-4 px-4 h-full">
            {children}
            <Toaster />
          </div>
        </SidebarInset>
      </div>
    </HomeProviders>
  );
}

const LogoIcon = () => {
  return (
    <Link
      href="/home"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <Image height={64} width={48} src={Logo} alt="RN Logo" />
    </Link>
  );
};
