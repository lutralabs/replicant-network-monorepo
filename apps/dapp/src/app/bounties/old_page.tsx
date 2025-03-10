'use client';
import Link from 'next/link';
import { useState } from 'react';

import { BountyCard } from '@/components/BountyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetBounties } from '@/hooks/useGetBounties';
import { bountyStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton component for loading state using UI Skeleton component
const BountyCardSkeleton = () => (
  <div className="w-[350px] h-[300px] rounded-lg border border-gray-200 p-6">
    <Skeleton className="w-3/4 h-5 mb-4" />
    <Skeleton className="w-1/2 h-4 mb-6" />
    <Skeleton className="w-full h-24 mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton className="w-1/3 h-8" />
      <Skeleton className="w-1/4 h-8" />
    </div>
  </div>
);

export default function Page() {
  const bounties = useGetBounties();
  const [showBadgeInfo, setShowBadgeInfo] = useState(false);

  // Filter bounties for each tab
  const activeBounties =
    bounties.bounties?.filter((bounty) => bounty.finalized === false) || [];
  const pastBounties =
    bounties.bounties?.filter((bounty) => bounty.finalized === true) || [];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Model Bounties</div>
          <div className="text-md mt-2 text-gray-600">
            A list of existing bounties for custom AI models.
          </div>
        </div>
        <Link href={'/bounties/bounty-form'}>
          <Button variant="cta-gradient">Create a Bounty</Button>
        </Link>
      </div>

      <div className="w-full mt-6 mb-8">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-600 border-dashed"
          onClick={() => setShowBadgeInfo(!showBadgeInfo)}
        >
          <HelpCircle size={16} />
          <span>Bounty Status Guide</span>
          {showBadgeInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>

        {showBadgeInfo && (
          <div className="mt-4 p-5 border border-gray-100 rounded-lg bg-gray-50/60 animate-in slide-in-from-top-2 duration-300 ease-in-out">
            <h4 className="text-sm font-medium mb-3 text-gray-700">
              Bounties go through the following phases:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-3 rounded-md border shadow-sm flex flex-col gap-2">
                <Badge variant="default" className="self-start">
                  Crowdfunding
                </Badge>
                <span className="text-sm text-gray-600">
                  Users can join the bounty by contributing MON.
                </span>
              </div>

              <div className="bg-white p-3 rounded-md border shadow-sm flex flex-col gap-2">
                <Badge variant="blue" className="self-start">
                  Submissions
                </Badge>
                <span className="text-sm text-gray-600">
                  Developers can submit the models to the bounty.
                </span>
              </div>

              <div className="bg-white p-3 rounded-md border shadow-sm flex flex-col gap-2">
                <Badge variant="tertiary" className="self-start">
                  Voting
                </Badge>
                <span className="text-sm text-gray-600">
                  Users who participated in the crowdfunding can vote for the
                  best model.
                </span>
              </div>

              <div className="bg-white p-3 rounded-md border shadow-sm flex flex-col gap-2">
                <Badge variant="secondary" className="self-start">
                  Completed
                </Badge>
                <span className="text-sm text-gray-600">
                  The model was successfully crowdfunded.
                </span>
              </div>

              <div className="bg-white p-3 rounded-md border shadow-sm flex flex-col gap-2">
                <Badge variant="destructive" className="self-start">
                  Failed
                </Badge>
                <span className="text-sm text-gray-600">
                  No model satisfied the requirements of the bounty.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Tabs className="mt-4" defaultValue="active">
        <TabsList className="grid w-[400px] grid-cols-2 bg-white">
          <TabsTrigger value="active">Active Bounties</TabsTrigger>
          <TabsTrigger value="past">Past Bounties</TabsTrigger>
        </TabsList>

        {/* Error handling */}
        {bounties.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load bounties. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading state with skeletons */}
        {bounties.isLoading && (
          <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
            {[1, 2, 3].map((i) => (
              <BountyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Content when not loading */}
        {!bounties.isLoading && !bounties.error && (
          <>
            <TabsContent value="active">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {activeBounties.length > 0 ? (
                  activeBounties.map((bounty) => (
                    <BountyCard
                      key={bounty.id}
                      status={bountyStatus(bounty)}
                      bounty={bounty}
                    />
                  ))
                ) : (
                  <div className="w-full text-center p-12 border border-dashed rounded-lg">
                    <p className="text-gray-500">
                      No active bounties available at the moment.
                    </p>
                    <p className="text-gray-400 mt-2">
                      Be the first to create one!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="mt-12 flex flex-wrap gap-x-12 gap-y-12">
                {pastBounties.length > 0 ? (
                  pastBounties.map((bounty) => (
                    <BountyCard
                      key={bounty.id}
                      status={bountyStatus(bounty)}
                      bounty={bounty}
                    />
                  ))
                ) : (
                  <div className="w-full text-center p-12 border border-dashed rounded-lg">
                    <p className="text-gray-500">No past bounties found.</p>
                    <p className="text-gray-400 mt-2">
                      Completed and Failed bounties will appear here.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
