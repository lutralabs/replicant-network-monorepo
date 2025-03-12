import { ArrowRightIcon, BlocksIcon, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from '../GlowingStarCard';
import { Badge } from '../ui/badge';

type ModelCardProps = {
  title: string;
  description: string;
  modelHash: string;
  id: string;
  imageUrl?: string;
  modelType?: string;
  createdAt?: string;
};

export const ModelCard = ({
  title,
  description,
  modelHash,
  id,
  imageUrl,
  modelType = 'Image Generation',
  createdAt,
}: ModelCardProps) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Link href={`/models/${modelHash}`} className="block w-[380px] group">
      <GlowingStarsBackgroundCard>
        <GlowingStarsTitle>{title}</GlowingStarsTitle>
        <div className="flex justify-between items-center">
          <GlowingStarsDescription className="line-clamp-2">
            {description}
          </GlowingStarsDescription>
          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <ArrowRightIcon className="text-gray-200" />
          </div>
        </div>
      </GlowingStarsBackgroundCard>
    </Link>
  );
};
