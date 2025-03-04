import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Bounty } from '@/hooks/useGetBounties';
import { formatBalance } from '@/lib/utils';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { useMemo, useState } from 'react';
import { formatEther } from 'viem';
import { useBalance } from 'wagmi';

export const FundBountyDialog = ({ bounty }: { bounty: Bounty }) => {
  const [amount, setAmount] = useState(0);
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Replace this with your desired wallet

  const balance = useBalance({
    address: (wallet?.address ?? '0x0') as `0x${string}`,
    config,
  });

  const formattedBalance = useMemo(() => {
    if (!balance || !balance.data) return 0;
    return formatBalance(balance.data.value);
  }, [balance.data]);

  const lowBalanceError = useMemo(() => {
    if (!balance || !balance.data) return false;

    return formattedBalance < amount;
  }, [formattedBalance, amount]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="cta-solid">Fund the Bounty &gt;</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crowdfund Bounty</DialogTitle>
          <DialogDescription>
            Contribute to the bounty, make the model come to life & own part of
            the tokenized model!
          </DialogDescription>
        </DialogHeader>
        <div className="flex text-gray-600 text-sm justify-between">
          <div>
            Crowdfunders:{' '}
            <span className="font-semibold text-black">
              {bounty.numFunders}
            </span>
          </div>
          <div>
            Max:{' '}
            <span className="font-semibold text-black">
              {formatEther(bounty.raiseCap) ?? 'Unlimited'}
            </span>
          </div>
          <div>
            Raised:{' '}
            <span className="font-semibold text-black">
              {formatEther(bounty.amountRaised)} MON
            </span>
          </div>
        </div>
        <div className="grid gap-2 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Amount
            </Label>
            <Input
              className={`col-span-3 ${lowBalanceError && 'border-red-500'} ring-none outline-none`}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              id="amount"
              type="number"
            />
          </div>
          <div className="flex items-center gap-x-2 text-gray-600 text-sm justify-between">
            <div>
              {lowBalanceError && (
                <div className="text-red-500 text-sm flex justify-end">
                  Insufficient Balance
                </div>
              )}
            </div>
            <div className="flex gap-x-2 items-center">
              {formattedBalance} MON
              <Button
                size="xs"
                type="button"
                variant="cta-solid"
                onClick={() => {
                  setAmount(formattedBalance);
                }}
              >
                MAX
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={lowBalanceError} variant="cta-solid" type="submit">
            Fund Bounty
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
