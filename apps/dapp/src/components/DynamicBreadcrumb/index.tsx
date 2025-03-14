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
} from '../ui/breadcrumb';

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
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const formattedLink = formatPathSegment(link);
          const isLastItem = pathNames.length === index + 1;

          return (
            <React.Fragment key={link}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage>
                    {formattedLink.length > 20
                      ? `${formattedLink.slice(0, 4)}...${formattedLink.slice(-4)}`
                      : formattedLink}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {formattedLink.length > 20
                      ? `${formattedLink.slice(0, 4)}...${formattedLink.slice(-4)}`
                      : formattedLink}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLastItem && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
