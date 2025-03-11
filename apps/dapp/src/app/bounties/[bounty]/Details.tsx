import type { Bounty } from '@/hooks/useGetBounty';
import React from 'react';
import { formatEther } from 'viem';
import { Calendar, Code, Clock, Users, Wallet, CoinsIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const Details = ({ bounty }: { bounty: Bounty }) => {
  const detailItems = [
    {
      label: 'Type of Model',
      value: 'Image Generation',
      icon: <Code className="h-5 w-5 text-gray-500" />,
    },
    {
      label: 'Requested Base Model',
      value: 'Stable Difusion',
      icon: <Code className="h-5 w-5 text-gray-500" />,
    },
    {
      label: 'Token Address',
      value: bounty.token,
      icon: <Wallet className="h-5 w-5 text-gray-500" />,
      isAddress: true,
    },
    {
      label: 'Max Bounty Amount',
      value: `${bounty.raiseCap ? 'Unlimited' : formatEther(bounty.raiseCap)} MON`,
      icon: <CoinsIcon className="h-5 w-5 text-gray-500" />,
    },
    {
      label: 'Creator Deposit',
      value: `${formatEther(
        BigInt(
          bounty.funders?.find((funder) => funder.funder_id === bounty.creator)
            ?.amount
        ) ?? BigInt(0)
      )} MON`,
      icon: <CoinsIcon className="h-5 w-5 text-gray-500" />,
    },
    {
      label: 'Crowdfunding Ends',
      value: new Date(Number(bounty.fundingPhaseEnd) * 1000).toLocaleDateString(
        undefined,
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      ),
      icon: <Calendar className="h-5 w-5 text-gray-500" />,
    },
    {
      label: 'Submissions End',
      value: new Date(
        Number(bounty.submissionPhaseEnd) * 1000
      ).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      icon: <Clock className="h-5 w-5 text-gray-500" />,
    },
    {
      label: 'Voting Ends',
      value: new Date(Number(bounty.votingPhaseEnd) * 1000).toLocaleDateString(
        undefined,
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      ),
      icon: <Users className="h-5 w-5 text-gray-500" />,
    },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-xl font-medium mb-6">Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailItems.map((item, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={i}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 transition-all hover:bg-gray-100"
            >
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <div className="text-sm text-gray-500">{item.label}</div>
                {item.isAddress ? (
                  <div className="font-mono text-sm text-purple-600 break-all">
                    {item.value}
                  </div>
                ) : (
                  <div className="font-medium">{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
