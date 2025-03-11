'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  Wallet,
  Brain,
  LayoutGrid,
  Filter,
  X,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

export const BountiesClient = () => {
  const { bounties, isLoading, error } = useGetBounties();
  const [showBadgeInfo, setShowBadgeInfo] = useState(false);
  const [userIntent, setUserIntent] = useState<
    'none' | 'fund' | 'submit' | 'browse'
  >('none');

  // Simplified state for filters
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('active');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Filter bounties for each tab - using useMemo to prevent unnecessary recalculations
  const activeBounties = useMemo(
    () => bounties?.filter((bounty) => bounty.finalized === false) || [],
    [bounties]
  );

  const pastBounties = useMemo(
    () => bounties?.filter((bounty) => bounty.finalized === true) || [],
    [bounties]
  );

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

  // Intent selection UI
  const IntentSelectionUI = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 relative"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-purple-50/30 to-transparent -z-10" />
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl -z-10" />


      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-purple-700"
      >
        What would you like to do?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 text-center mb-16 max-w-2xl text-lg"
      >
        Select an option below to find the most relevant bounties for your needs
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {[
          {
            intent: 'fund',
            icon: <Wallet size={32} strokeWidth={1.5} />,
            title: 'Fund Model Bounties',
            description:
              'Contribute to exciting bounties, help bring innovative ideas to life and earn rewards in return',
            color: 'blue',
          },
          {
            intent: 'submit',
            icon: <Brain size={32} strokeWidth={1.5} />,
            title: 'Submit a Model',
            description:
              'Showcase your expertise by submitting models to open bounties and earn rewards',
            color: 'purple',
          },
          {
            intent: 'browse',
            icon: <LayoutGrid size={32} strokeWidth={1.5} />,
            title: 'Browse All Bounties',
            description:
              'Explore the full marketplace of active and past bounties',
            color: 'green',
          },
        ].map((option, index) => (
          <motion.button
            key={option.intent}
            type="button"
            onClick={() => setUserIntent(option.intent as any)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + index * 0.1 }}
            className={
              'group hover:cursor-pointer p-0 rounded-2xl transition-all flex flex-col items-center overflow-hidden'
            }
          >
            <div
              className={`w-full h-full p-8 bg-white border border-${option.color}-100 rounded-2xl relative overflow-hidden group-hover:shadow-xl group-hover:shadow-${option.color}-100/50 group-hover:-translate-y-1 transition-all duration-300`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${option.color}-50 to-${option.color}-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`p-4 bg-gradient-to-br from-${option.color}-500 to-${option.color}-600 rounded-2xl mb-6 text-white shadow-lg shadow-${option.color}-200 group-hover:shadow-${option.color}-300 group-hover:scale-110 transition-all duration-300`}
                >
                  {option.icon}
                </div>
                <h3
                  className={`text-xl font-semibold mb-4 text-${option.color}-900 group-hover:text-${option.color}-700 transition-colors`}
                >
                  {option.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <Link href={'/bounties/bounty-form'}>
          <Button variant="outline" className="px-6 py-2 text-base font-medium">
            Create Your Own Bounty
          </Button>
        </Link>

      </motion.div>
    </motion.div>
  );

  // Main content with bounties
  const MainContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-12 pb-12"
    >
      {userIntent === 'browse' ? (
        <div className="flex flex-wrap gap-x-12 gap-y-12">
          {getCurrentBounties().length > 0 ? (
            getCurrentBounties().map((bounty, i) => (
              <motion.div
                key={bounty.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BountyCard status={bountyStatus(bounty)} bounty={bounty} />
              </motion.div>
            ))
          ) : (
            <div className="w-full text-center p-12 border border-dashed rounded-lg">
              <p className="text-gray-500">
                No {activeTab === 'active' ? 'active' : 'past'} bounties found
                {statusFilters.length > 0 ? ' with selected filters' : ''}.
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
      ) : (
        <>
          <h3 className="text-xl font-medium mb-6">
            {userIntent === 'fund'
              ? 'Bounties Ready for Funding'
              : 'Bounties Open for Submissions'}
          </h3>
          <div className="flex flex-wrap gap-x-12 gap-y-12">
            {getIntentBounties().length > 0 ? (
              getIntentBounties().map((bounty, i) => (
                <motion.div
                  key={bounty.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <BountyCard status={bountyStatus(bounty)} bounty={bounty} />
                </motion.div>
              ))
            ) : (
              <div className="w-full text-center p-12 border border-dashed rounded-lg">
                <p className="text-gray-500">
                  No{' '}
                  {userIntent === 'fund' ? 'crowdfunding' : 'submission-ready'}{' '}
                  bounties available.
                </p>
                <p className="text-gray-400 mt-2">
                  Check back later or browse all bounties.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="w-full">
      {userIntent === 'none' ? (
        <IntentSelectionUI />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                  ? 'Earn rewards as you contribute to open bounties.'
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

          {/* Add simplified filter interface in browse mode */}
          {userIntent === 'browse' && <FilterInterface />}

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
                className="mt-12 pb-12 flex flex-wrap gap-x-12 gap-y-12"
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
                <MainContent />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
