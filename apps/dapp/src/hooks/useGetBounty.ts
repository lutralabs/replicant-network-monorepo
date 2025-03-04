import { config, wagmiContractConfig } from '@/wagmi';
import { readContract } from '@wagmi/core';
import { useState, useEffect } from 'react';
import type { Bounty } from './useGetBounties';
import { repNetManagerAbi } from '@/generated/RepNetManager';

export function useGetBounty(id: number) {
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBounty = async () => {
      if (id === undefined || id === null) {
        setError(new Error('Bounty ID is required'));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log(`Fetching bounty with ID: ${id}`);
        const bountyId = BigInt(id);

        // Fetch base bounty data from blockchain
        const bountyData = await readContract(config, {
          abi: repNetManagerAbi,
          functionName: 'getCrowdfunding',
          args: [bountyId],
          address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        });

        // Fetch additional blockchain data
        const isActive = await readContract(config, {
          abi: repNetManagerAbi,
          functionName: 'isCrowdfundingActive',
          args: [bountyId],
          address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        });

        // Fetch metadata from API instead of directly from Supabase
        let supabaseData = null;
        try {
          const response = await fetch(`/api/bounty?id=${id}`);
          if (response.ok) {
            const result = await response.json();
            supabaseData = result.data;
          }
        } catch (error) {
          console.error(`Error fetching metadata for bounty ${id}:`, error);
        }

        // Combine all data
        const enrichedBounty: Bounty = {
          ...bountyData,
          submissionIds: [...bountyData.submissionIds], // Convert readonly array to mutable array
          isActive,
          // Add Supabase data if available
          ...(supabaseData && {
            title: supabaseData.title,
            description: supabaseData.description,
            type: supabaseData.type,
            prompters: supabaseData.prompters,
            discord: supabaseData.discord,
            email: supabaseData.email,
            telegram: supabaseData.telegram,
          }),
        };

        setBounty(enrichedBounty);
        console.log('Enriched Bounty with API data:', enrichedBounty);
      } catch (error) {
        console.error(`Error fetching bounty with ID ${id}:`, error);
        setError(
          error instanceof Error ? error : new Error('Failed to fetch bounty')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBounty();
  }, [id]);

  return {
    bounty,
    isLoading,
    error,
  };
}
