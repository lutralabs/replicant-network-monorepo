'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { BountyCard } from '@/components/BountyCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetBounties } from '@/hooks/useGetBounties';
import { bountyStatus } from '@/lib/utils';
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  HelpCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { Suspense, useEffect, useMemo, useState } from 'react';

// Skeleton component with Framer Motion
const BountyCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-[350px] h-[300px] rounded-lg border border-gray-200 p-6"
  >
    <Skeleton className="w-3/4 h-5 mb-4" />
    <Skeleton className="w-1/2 h-4 mb-6" />
    <Skeleton className="w-full h-24 mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton className="w-1/3 h-8" />
      <Skeleton className="w-1/4 h-8" />
    </div>
  </motion.div>
);

const IntentStatus = {
  fund: 'crowdfunding',
  submit: 'submissions',
};

// Array of featured bounty IDs - you can hardcode this
const FEATURED_BOUNTY_IDS = [9, 4];

// Featured Bounty Card component
const FeaturedBountyCard = ({ bounty }) => {
  if (!bounty) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl opacity-70 group-hover:opacity-100 blur transition duration-300" />
      <div className="relative">
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={10} />
            <span>Featured</span>
          </div>
        </div>
        <BountyCard status={bountyStatus(bounty)} bounty={bounty} />
      </div>
    </motion.div>
  );
};

function BountiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent');

  const { bounties, isLoading, error } = useGetBounties();

  const [showBadgeInfo, setShowBadgeInfo] = useState(false);

  // Simplified state for filters
  const [statusFilters, setStatusFilters] = useState<string[]>(
    IntentStatus[intent] ? [IntentStatus[intent]] : []
  );

  const [activeTab, setActiveTab] = useState<string>('active');
  const [activeFilters, setActiveFilters] = useState<string[]>(
    IntentStatus[intent] ? ['Status'] : []
  );

  // Find featured bounties
  const featuredBounties = useMemo(
    () =>
      bounties?.filter((bounty) =>
        FEATURED_BOUNTY_IDS.includes(Number(bounty.id))
      ) || [],
    [bounties]
  );

  // Filter bounties for each tab - using useMemo to prevent unnecessary recalculations
  const activeBounties = useMemo(() => {
    const filtered =
      bounties?.filter((bounty) => bounty.finalized === false) || [];
    // Remove featured bounties from the regular list if they're in active bounties
    return filtered.filter(
      (bounty) => !FEATURED_BOUNTY_IDS.includes(Number(bounty.id))
    );
  }, [bounties]);

  const pastBounties = useMemo(() => {
    const filtered =
      bounties?.filter((bounty) => bounty.finalized === true) || [];
    // Remove featured bounties from the regular list if they're in past bounties
    return filtered.filter(
      (bounty) => !FEATURED_BOUNTY_IDS.includes(Number(bounty.id))
    );
  }, [bounties]);

  // Get available status filters based on active tab
  const getAvailableFilters = () => {
    if (activeTab === 'active') {
      return ['crowdfunding', 'submissions', 'voting', 'stale'];
    }
    return ['completed', 'failed'];
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setStatusFilters([]); // Reset filters when changing tabs
  };

  // Track active filters for UI display
  useEffect(() => {
    const filters = [];
    if (statusFilters.length > 0) filters.push('Status');
    setActiveFilters(filters);
  }, [statusFilters]);

  // Apply status filters to the bounty list
  const applyStatusFilters = (bountyList) => {
    // If no status filters, return the original list
    if (statusFilters.length === 0) return bountyList;

    // Otherwise, filter by selected statuses
    return bountyList.filter((bounty) =>
      statusFilters.includes(bountyStatus(bounty))
    );
  };

  // Toggle status filter
  const toggleStatusFilter = (status) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Get the current list of bounties based on active/past toggle and filters
  const getCurrentBounties = () => {
    const currentList = activeTab === 'active' ? activeBounties : pastBounties;
    return applyStatusFilters(currentList);
  };

  // Get featured bounties for the current tab
  const getCurrentFeaturedBounties = () => {
    const isActive = activeTab === 'active';
    return featuredBounties.filter((bounty) =>
      isActive ? !bounty.finalized : bounty.finalized
    );
  };

  // Simplified filter interface component
  const FilterInterface = () => (
    <div className="space-y-4 mt-6 mb-6">
      <div className="flex items-center gap-4">
        {/* Use Tabs component with onValueChange to reset filters */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="">
          <TabsList className="grid grid-cols-2 bg-white">
            <TabsTrigger value="active">Active Bounties</TabsTrigger>
            <TabsTrigger value="past">Past Bounties</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Status filter dropdown with dynamically filtered options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-2">
              <Filter size={14} /> Status Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>
              Filter by Status ({activeTab === 'active' ? 'Active' : 'Past'})
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Only show relevant filter options based on tab */}
            {getAvailableFilters().includes('crowdfunding') && (
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('crowdfunding')}
                onCheckedChange={() => toggleStatusFilter('crowdfunding')}
              >
                Crowdfunding
              </DropdownMenuCheckboxItem>
            )}

            {getAvailableFilters().includes('submissions') && (
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('submissions')}
                onCheckedChange={() => toggleStatusFilter('submissions')}
              >
                Submissions
              </DropdownMenuCheckboxItem>
            )}

            {getAvailableFilters().includes('voting') && (
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('voting')}
                onCheckedChange={() => toggleStatusFilter('voting')}
              >
                Voting
              </DropdownMenuCheckboxItem>
            )}

            {getAvailableFilters().includes('stale') && (
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('stale')}
                onCheckedChange={() => toggleStatusFilter('stale')}
              >
                Stale
              </DropdownMenuCheckboxItem>
            )}

            {getAvailableFilters().includes('completed') && (
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('completed')}
                onCheckedChange={() => toggleStatusFilter('completed')}
              >
                Completed
              </DropdownMenuCheckboxItem>
            )}

            {getAvailableFilters().includes('failed') && (
              <DropdownMenuCheckboxItem
                checked={statusFilters.includes('failed')}
                onCheckedChange={() => toggleStatusFilter('failed')}
              >
                Failed
              </DropdownMenuCheckboxItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filters display - Moved to a new line and made badges larger */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {statusFilters.map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 transition-colors border-gray-200"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <button
                type="button"
                onClick={() => toggleStatusFilter(filter)}
                className="ml-2 text-gray-500 hover:text-gray-900"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col w-full items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 h-8 w-8 p-0"
                onClick={() => router.push('/home')}
              >
                <ArrowLeft size={16} />
              </Button>
              <div className="text-lg font-semibold">Model Bounties</div>
            </div>
            <div className="text-md mt-2 text-gray-600 ml-10">
              A list of existing bounties for custom AI models.
            </div>
          </div>
          <Link href={'/create-bounty'} className="w-full sm:w-auto">
            <Button variant="cta-gradient" className="w-full sm:w-auto">
              Create a Bounty
            </Button>
          </Link>
        </div>

        {/* Show status guide only in browse mode */}
        <div className="w-full mt-6 mb-4">
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

        {/* Add simplified filter interface in browse mode */}
        <FilterInterface />

        {/* Error handling */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load bounties. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Use AnimatePresence for smooth transitions between loading states */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 pb-12 flex flex-wrap gap-x-12 gap-y-12 justify-center sm:justify-start"
            >
              {[1, 2, 3].map((i) => (
                <BountyCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Featured Bounties Section */}
              {getCurrentFeaturedBounties().length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Featured Bounties
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-x-12 gap-y-12 justify-center sm:justify-start">
                    {getCurrentFeaturedBounties().map((bounty, i) => (
                      <motion.div
                        key={bounty.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <FeaturedBountyCard bounty={bounty} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gentle separator - only show if there are featured bounties */}
              {getCurrentFeaturedBounties().length > 0 && (
                <div className="mb-8 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">
                      All Bounties
                    </span>
                  </div>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 pb-12"
              >
                <div className="flex flex-wrap gap-x-12 gap-y-12 justify-center sm:justify-start">
                  {getCurrentBounties().length > 0 ? (
                    getCurrentBounties().map((bounty, i) => (
                      <motion.div
                        key={bounty.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="w-full sm:w-auto flex justify-center"
                      >
                        <BountyCard
                          status={bountyStatus(bounty)}
                          bounty={bounty}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="w-full text-center p-12 border border-dashed rounded-lg">
                      <p className="text-gray-500">
                        No {activeTab === 'active' ? 'active' : 'past'} bounties
                        found
                        {statusFilters.length > 0
                          ? ' with selected filters'
                          : ''}
                        .
                      </p>
                      <p className="text-gray-400 mt-2">
                        {statusFilters.length > 0
                          ? 'Try adjusting your filters.'
                          : activeTab === 'active'
                            ? 'Be the first to create one!'
                            : 'Completed and Failed bounties will appear here.'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full">
          <div className="flex w-full items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="mr-2 h-8 w-8 p-0" />
                <div className="text-lg font-semibold">Model Bounties</div>
              </div>
              <div className="text-md mt-2 text-gray-600 ml-10">
                A list of existing bounties for custom AI models.
              </div>
            </div>
            <div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="mt-12 pb-12 flex flex-wrap gap-x-12 gap-y-12">
            {[1, 2, 3].map((i) => (
              <BountyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <BountiesContent />
    </Suspense>
  );
}
