import Link from 'next/link';
import React from 'react';

import { Badge } from '../ui/badge';

type ModelCardProps = {
  title: string;
  description: string;
  bountyOwnerAddress: string;
  id: string;
};

export const ModelCard = ({
  title,
  description,
  bountyOwnerAddress,
  id,
}: ModelCardProps) => {
  return (
    <Link href={`/models/${id}`}>
      <div className="border-sidebar-border flex h-[200px] w-[380px] flex-col justify-between rounded-md border-2 bg-white px-8 py-4 hover:cursor-pointer hover:opacity-90">
        <div>
          <div className="truncate text-lg font-semibold">{title}</div>
          <div className="line-clamp-4 text-sm text-gray-600">
            {description}
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-2">
          By
          <Badge>{`${bountyOwnerAddress.slice(0, 6)}...${bountyOwnerAddress.slice(-4)}`}</Badge>
        </div>
      </div>
    </Link>
  );
};
