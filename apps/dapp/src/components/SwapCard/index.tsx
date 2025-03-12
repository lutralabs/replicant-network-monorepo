'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useFundBounty } from '@/hooks/useFundBounty';
import type { Bounty } from '@/hooks/useGetBounty';
import { useGetSymbol } from '@/hooks/useGetSymbol';
import { useWithdrawFunding } from '@/hooks/useWithdrawFunding';
import { formatBalance } from '@/lib/utils';
import { config } from '@/wagmi';
import {
  type ConnectedWallet,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';
import { circIn } from 'framer-motion';
import { Check, ChevronDown, Info, Loader2, Repeat } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useBalance } from 'wagmi';
import { ErrorToast } from '../Toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

// Token list for paying
const base = [
  {
    id: 'monad',
    name: 'Monad',
    symbol: 'MON',
    icon: 'https://docs.monad.xyz/img/monad_logo.png',
  },
  // {
  //   id: 'eth',
  //   name: 'Ethereum',
  //   symbol: 'ETH',
  //   icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  // },
  // {
  //   id: 'btc',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  // },
  // {
  //   id: 'matic',
  //   name: 'Polygon',
  //   symbol: 'MATIC',
  //   icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  // },
  // {
  //   id: 'sol',
  //   name: 'Solana',
  //   symbol: 'SOL',
  //   icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  // },
];

export default function SwapCard({
  bounty,
  mode,
}: { bounty: Bounty; mode: 'buy' | 'sell' }) {
  const { data: tokenInfo, isLoading: dynamicTokenLoading } = useGetSymbol(
    bounty.token
  );

  const monadToken = {
    id: 'monad',
    name: 'Monad',
    symbol: 'MON',
    icon: 'https://docs.monad.xyz/img/monad_logo.png',
  };

  const dynamicToken = useMemo(
    () => ({
      id: bounty.token,
      name: tokenInfo?.name || 'Token',
      symbol: tokenInfo?.symbol.toUpperCase() || '--',
      icon: bounty.token_img_url || undefined,
    }),
    [bounty.token, tokenInfo]
  );

  const payToken = mode === 'buy' ? monadToken : dynamicToken;
  const receiveToken = mode === 'buy' ? dynamicToken : monadToken;

  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Replace this with your desired wallet

  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState<boolean>(false);

  const switchChain = async (wallet: ConnectedWallet) => {
    try {
      setIsSwitchingChain(true);
      await wallet.switchChain(10143);
    } finally {
      setIsSwitchingChain(false);
    }
  };

  const { mutate: fund } = useFundBounty();
  const { mutate: withdraw } = useWithdrawFunding();

  const balance = useBalance({
    address: (wallet?.address ?? '0x0') as `0x${string}`,
    config,
  });

  const tokenBalance = useBalance({
    address: (wallet?.address ?? '0x0') as `0x${string}`,
    token: bounty.token as `0x${string}`,
    config,
  });

  const formattedBalance = useMemo(() => {
    if (!balance || !balance.data) return 0;
    return formatBalance(balance.data.value);
  }, [balance.data]);

  const formattedTokenBalance = useMemo(() => {
    if (!tokenBalance || !tokenBalance.data) return 0;
    return formatBalance(tokenBalance.data.value);
  }, [tokenBalance.data]);

  const handlePayAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (payAmount && Number(value) > formattedBalance) {
        setPayAmount(formattedBalance.toString());
        return;
      }
      setPayAmount(value);
      // Calculate the receive amount based on exchange rates
      setReceiveAmount((Number(value) * 1000000).toString());
    }
  };

  const handleReceiveAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setReceiveAmount(value);
      // Calculate the pay amount based on exchange rates
      setPayAmount((Number(value) / 1000000).toString());
    }
  };

  const widgetStatus = useMemo(() => {
    if (!ready || (mode === 'buy' ? false : dynamicTokenLoading)) {
      return 'Loading...';
    }
    if (authenticated) {
      return 'Swap';
    }
    if (wallet.chainId !== 'eip155:10143') {
      return 'Wrong chain';
    }
    return 'Connect wallet';
  }, [dynamicTokenLoading, ready, authenticated, mode]);

  const handleSwap = async () => {
    setIsLoading(true);
    try {
      if (mode === 'buy') {
        if (!payAmount) {
          ErrorToast({ error: 'Please enter an amount' });

          return;
        }
        fund({ amount: Number(payAmount), id: bounty.id });
      }
      if (mode === 'sell') {
        if (!payAmount) {
          ErrorToast({ error: 'Please enter an amount' });

          return;
        }
        await withdraw({ id: bounty.id });
      }
    } catch (error) {
      console.error('Swap failed', error);
      ErrorToast({ error: 'Swap failed' });
    }
    setIsLoading(false);
  };

  const handleActionButtonClick = async () => {
    if (ready && authenticated) {
      if (wallet.chainId !== 'eip155:10143') {
        await switchChain(wallet);
      } else {
        handleSwap();
      }
    } else {
      login();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto h-fit bg-white border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-4">
          <Repeat className="h-5 w-5 text-purple-500" />
          <h2 className="text-md font-semibold">Buy Model Tokens</h2>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* You pay section */}
        <div className="bg-slate-50 rounded-lg p-3 mb-1">
          <div className="text-sm text-gray-500 mb-2">You pay</div>
          <div className="flex items-center gap-2 justify-between">
            <Input
              type="text"
              value={payAmount}
              onChange={(e) => {
                handlePayAmountChange(e.target.value);
              }}
              className="text-3xl md:text-2xl shadow-none border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 h-auto max-w-[120px]"
                >
                  <div className="flex items-center gap-2">
                    {mode === 'buy' ? (
                      <>
                        <Image
                          src={payToken.icon || '/placeholder.svg'}
                          alt={payToken.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span>{payToken?.symbol}</span>
                      </>
                    ) : dynamicTokenLoading ? (
                      <span>--</span>
                    ) : (
                      <>
                        {payToken.icon && (
                          <Image
                            src={payToken.icon || '/placeholder.svg'}
                            alt={payToken.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        )}
                        <span>{payToken?.symbol}</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 ml-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-w-[160px]">
                <DropdownMenuItem
                  onClick={() => {}}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                >
                  {mode === 'buy' ? (
                    <>
                      <Image
                        src={payToken.icon || '/placeholder.svg'}
                        alt={payToken.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{payToken.symbol}</span>
                      <Check className="h-4 w-4 ml-auto" />
                    </>
                  ) : dynamicTokenLoading ? (
                    <span>--</span>
                  ) : (
                    <>
                      {payToken.icon && (
                        <Image
                          src={payToken.icon || '/placeholder.svg'}
                          alt={payToken.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span>{payToken.symbol}</span>
                      <Check className="h-4 w-4 ml-auto" />
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Only show balance and MAX button for MON token when buying */}
          {mode === 'buy' && (
            <div className="flex justify-end items-center mt-2 text-sm">
              <span className="text-gray-500 mr-1">
                {formattedBalance.toFixed(4)} MON
              </span>
              <Button
                className="px-2 text-purple-400 hover:text-purple-500 py-0"
                size="max"
                variant="max"
                onClick={() => {
                  handlePayAmountChange(formattedBalance.toString());
                }}
              >
                MAX
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-center -my-3 relative z-10">
          <div className="bg-white rounded-full p-2 shadow-sm border border-gray-100">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Arrow down</title>
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* You receive section */}
        <div className="bg-slate-50 rounded-lg p-3 mt-1">
          <div className="text-sm text-gray-500 mb-2">You receive</div>
          <div className="flex items-center gap-2 justify-between">
            <Input
              type="text"
              value={receiveAmount}
              onChange={(e) => {
                handleReceiveAmountChange(e.target.value);
              }}
              className="text-3xl md:text-2xl shadow-none border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex items-center justify-center gap-2 ${
                    receiveToken
                      ? 'bg-white border border-gray-200'
                      : 'bg-purple-500 hover:bg-purple-400 text-white'
                  } rounded-full px-3 py-1 h-auto max-w-[120px]`}
                >
                  <div className="flex items-center gap-2">
                    {mode === 'buy' ? (
                      dynamicTokenLoading ? (
                        <span>--</span>
                      ) : (
                        <>
                          {receiveToken.icon && (
                            <Image
                              src={receiveToken.icon || '/placeholder.svg'}
                              alt={receiveToken.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          )}
                          <span>{receiveToken.symbol}</span>
                        </>
                      )
                    ) : (
                      <>
                        <Image
                          src={receiveToken.icon || '/placeholder.svg'}
                          alt={receiveToken.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span>{receiveToken?.symbol}</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 ml-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-w-[160px]">
                <DropdownMenuItem
                  onClick={() => {}}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                >
                  {mode === 'buy' ? (
                    dynamicTokenLoading ? (
                      <span>--</span>
                    ) : (
                      <>
                        {receiveToken.icon && (
                          <Image
                            src={receiveToken.icon || '/placeholder.svg'}
                            alt={receiveToken.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span>{receiveToken.symbol}</span>
                        <Check className="h-4 w-4 ml-auto" />
                      </>
                    )
                  ) : (
                    <>
                      <Image
                        src={receiveToken.icon || '/placeholder.svg'}
                        alt={receiveToken.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{receiveToken.symbol}</span>
                      <Check className="h-4 w-4 ml-auto" />
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Only show balance and MAX button for MON token when selling */}
          {mode === 'sell' && (
            <div className="flex justify-end items-center mt-2 text-sm">
              <span className="text-gray-500 mr-1">{formattedBalance}</span>
              <Button
                className="px-2 text-purple-400 hover:text-purple-500 h-auto py-0"
                size="xs"
                type="button"
                variant="link"
                onClick={() => {
                  handleReceiveAmountChange(formattedBalance.toString());
                }}
              >
                MAX
              </Button>
            </div>
          )}
          {/* Show token balance without MAX button when buying */}
          {mode === 'buy' && !dynamicTokenLoading && (
            <div className="flex justify-end items-center mt-2 text-sm">
              <span className="text-gray-500">
                {formattedTokenBalance} {receiveToken.symbol}
              </span>
            </div>
          )}
        </div>

        {/* Fees section */}
        {authenticated && (
          <div className="mt-2 -mb-4">
            {/* Expandable fees content */}
            <Accordion type="single" collapsible className="border-none">
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="py-2 mb-1 hover:no-underline w-full">
                  <div className="flex items-center text-sm text-gray-500">
                    <Info className="h-4 w-4 mr-1" />
                    <span>Fee info</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-3 py-2 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Swap fee (0%)</span>
                      <span className="font-medium">0 {payToken.symbol}</span>
                    </div>
                    {/* <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-500">Estimated gas</span>
                      <span className="font-medium">
                        ~0.0005 {payToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-500">Price impact</span>
                      <span className="font-medium text-green-500">
                        {payAmount && Number.parseFloat(payAmount) > 0
                          ? '< 0.01%'
                          : '0.00%'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-500">Minimum received</span>
                      <span className="font-medium">
                        {receiveAmount && Number.parseFloat(receiveAmount) > 0
                          ? (Number.parseFloat(receiveAmount) * 0.995).toFixed(
                              6
                            )
                          : '0'}{' '}
                        {receiveToken?.symbol || ''}
                      </span>
                    </div> */}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Connect wallet button */}
        <Button
          className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white py-6 rounded-xl text-lg font-medium"
          onClick={handleActionButtonClick}
          disabled={
            !ready ||
            (mode === 'buy' ? false : dynamicTokenLoading) ||
            isLoading ||
            isSwitchingChain
          }
        >
          <div className="flex items-center justify-center gap-x-2">
            {widgetStatus}
            {isLoading && (
              <Loader2 className="h-6 w-6 ml-2 text-white animate-spin" />
            )}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
