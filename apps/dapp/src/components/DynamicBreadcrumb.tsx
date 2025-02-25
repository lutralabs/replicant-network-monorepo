// /components/NextBreadcrumb.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { type ReactNode } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const DynamicBreadcrumb = () => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const itemLink = link;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <BreadcrumbItem key={index}>
              {pathNames.length === index + 1 ? (
                <BreadcrumbPage>{itemLink}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={href}>{itemLink}</BreadcrumbLink>
              )}
              {pathNames.length !== index + 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
