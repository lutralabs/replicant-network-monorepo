import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';
import { ArrowRightIcon, BlocksIcon, User } from 'lucide-react';

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
    <Link href={`/models/${modelHash}`} className="block w-[380px]">
      <div className="group relative h-[220px] w-full overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
        {/* Optional header image */}
        {imageUrl && (
          <div className="h-24 w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Content container */}
        <div className="flex h-full flex-col justify-between p-5">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {modelType}
              </span>
              <div className="text-gray-400 text-xs">
                {formattedDate && <span>{formattedDate}</span>}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="mt-1 line-clamp-3 text-sm text-gray-500">
                {description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-gray-400" />
              <Badge variant="outline" className="text-xs font-normal">
                {`${modelHash.slice(0, 6)}...${modelHash.slice(-4)}`}
              </Badge>
            </div>

            <ArrowRightIcon className="h-5 w-5 text-gray-300 transition-all group-hover:text-blue-500 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};
