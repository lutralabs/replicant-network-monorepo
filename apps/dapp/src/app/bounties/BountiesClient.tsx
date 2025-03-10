'use client';

import Link from 'next/link';
import { useState } from 'react';

import { BountyCard } from '@/components/BountyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetBounties } from '@/hooks/useGetBounties';
import { bountyStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowLeft,
  CreditCard,
  Code,
  Compass,
} from 'lucide-react';
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

export const BountiesClient = () => {
  const bounties = useGetBounties();
  const [showBadgeInfo, setShowBadgeInfo] = useState(false);
  const [userIntent, setUserIntent] = useState<
    'none' | 'fund' | 'submit' | 'browse'
  >('none');

  // Filter bounties for each tab
  const activeBounties =
    bounties.bounties?.filter((bounty) => bounty.finalized === false) || [];
  const pastBounties =
    bounties.bounties?.filter((bounty) => bounty.finalized === true) || [];

  // Filter bounties based on user intent
  const getIntentBounties = () => {
    if (userIntent === 'fund') {
      return activeBounties.filter(
        (bounty) => bountyStatus(bounty) === 'crowdfunding'
      ); // Crowdfunding phase
    }
    if (userIntent === 'submit') {
      return activeBounties.filter(
        (bounty) => bountyStatus(bounty) === 'submissions'
      ); // Submissions phase
    }
    return activeBounties;
  };

  // Intent selection UI
  const IntentSelectionUI = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-3xl font-bold mb-4 text-center">
        What would you like to do?
      </h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl">
        Select an option below to find the most relevant bounties for your needs
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <button
          type="button"
          onClick={() => setUserIntent('fund')}
          className="group relative overflow-hidden p-8 rounded-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 border border-blue-100 shadow-sm hover:shadow-md hover:shadow-blue-100/50 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-200 to-transparent opacity-30 rounded-bl-full" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 bg-blue-100 rounded-xl mb-5 text-blue-600 group-hover:bg-blue-200 group-hover:text-blue-700 transition-all">
              <CreditCard size={36} />
            </div>
            <div className="text-xl font-semibold mb-3 text-blue-900">
              Fund Model Bounties
            </div>
            <p className="text-gray-600 text-center">
              Contribute MON to exciting AI model projects
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setUserIntent('submit')}
          className="group relative overflow-hidden p-8 rounded-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white hover:from-purple-100 hover:to-purple-50 border border-purple-100 shadow-sm hover:shadow-md hover:shadow-purple-100/50 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-200 to-transparent opacity-30 rounded-bl-full" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 bg-purple-100 rounded-xl mb-5 text-purple-600 group-hover:bg-purple-200 group-hover:text-purple-700 transition-all">
              <Code size={36} />
            </div>
            <div className="text-xl font-semibold mb-3 text-purple-900">
              Submit a Model
            </div>
            <p className="text-gray-600 text-center">
              For developers to submit models to open bounties
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setUserIntent('browse')}
          className="group relative overflow-hidden p-8 rounded-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white hover:from-green-100 hover:to-green-50 border border-green-100 shadow-sm hover:shadow-md hover:shadow-green-100/50 transform hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-200 to-transparent opacity-30 rounded-bl-full" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 bg-green-100 rounded-xl mb-5 text-green-600 group-hover:bg-green-200 group-hover:text-green-700 transition-all">
              <Compass size={36} />
            </div>
            <div className="text-xl font-semibold mb-3 text-green-900">
              Browse All Bounties
            </div>
            <p className="text-gray-600 text-center">
              Explore all active and past bounty projects
            </p>
          </div>
        </button>
      </div>

      <Link href={'/bounties/bounty-form'} className="mt-12">
        <Button
          variant="outline"
          className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Or Create Your Own Bounty
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="w-full">
      {userIntent === 'none' ? (
        <IntentSelectionUI />
      ) : (
        <>
          <div className="flex w-full items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 h-8 w-8 p-0"
                  onClick={() => setUserIntent('none')}
                >
                  <ArrowLeft size={16} />
                  <span className="sr-only">Back to options</span>
                </Button>
                <div className="text-lg font-semibold">
                  {userIntent === 'fund'
                    ? 'Fund Model Bounties'
                    : userIntent === 'submit'
                      ? 'Submit a Model'
                      : 'Model Bounties'}
                </div>
              </div>
              <div className="text-md mt-2 text-gray-600 ml-10">
                {userIntent === 'fund'
                  ? 'Contribute to these bounties currently in the crowdfunding phase.'
                  : userIntent === 'submit'
                    ? 'Bounties currently accepting model submissions from developers.'
                    : 'A list of existing bounties for custom AI models.'}
              </div>
            </div>
            <Link href={'/bounties/bounty-form'}>
              <Button variant="cta-gradient">Create a Bounty</Button>
            </Link>
          </div>

          {/* Show status guide only in browse mode */}
          {userIntent === 'browse' && (
            <div className="w-full mt-6 mb-8">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-gray-600 border-dashed"
                onClick={() => setShowBadgeInfo(!showBadgeInfo)}
              >
                <HelpCircle size={16} />
                <span>Bounty Status Guide</span>
                {showBadgeInfo ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
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
                        Users who participated in the crowdfunding can vote for
                        the best model.
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
          )}

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
            <div className="mt-12 pb-12 flex flex-wrap gap-x-12 gap-y-12">
              {[1, 2, 3].map((i) => (
                <BountyCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Content when not loading */}
          {!bounties.isLoading &&
            !bounties.error &&
            (userIntent === 'browse' ? (
              <Tabs className="mt-4" defaultValue="active">
                <TabsList className="grid w-[400px] grid-cols-2 bg-white">
                  <TabsTrigger value="active">Active Bounties</TabsTrigger>
                  <TabsTrigger value="past">Past Bounties</TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <div className="mt-12 pb-12 flex flex-wrap gap-x-12 gap-y-12">
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
                  <div className="mt-12 pb-12 flex flex-wrap gap-x-12 gap-y-12">
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
              </Tabs>
            ) : (
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-6">
                  {userIntent === 'fund'
                    ? 'Bounties Ready for Funding'
                    : 'Bounties Open for Submissions'}
                </h3>
                <div className="flex flex-wrap gap-x-12 gap-y-12">
                  {getIntentBounties().length > 0 ? (
                    getIntentBounties().map((bounty) => (
                      <BountyCard
                        key={bounty.id}
                        status={bountyStatus(bounty)}
                        bounty={bounty}
                      />
                    ))
                  ) : (
                    <div className="w-full text-center p-12 border border-dashed rounded-lg">
                      <p className="text-gray-500">
                        No{' '}
                        {userIntent === 'fund'
                          ? 'crowdfunding'
                          : 'submission-ready'}{' '}
                        bounties available.
                      </p>
                      <p className="text-gray-400 mt-2">
                        Check back later or browse all bounties.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};
