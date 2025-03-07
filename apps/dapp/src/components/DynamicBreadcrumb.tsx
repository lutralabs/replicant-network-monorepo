'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

// Helper function to format path segments
const formatPathSegment = (segment: string): string => {
  // Don't transform segments that are numeric or IDs
  if (/^\d+$/.test(segment)) {
    return segment; // Return numbers unchanged
  }

  // Split by hyphens or underscores and capitalize each word
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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

        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const formattedLink = formatPathSegment(link);
          const isLastItem = pathNames.length === index + 1;

          return (
            <React.Fragment key={link}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage>{formattedLink}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{formattedLink}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
