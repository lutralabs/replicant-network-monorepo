'use client';

import type React from 'react';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Repeat, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePrivy } from '@privy-io/react-auth';

// Token list for paying
const payTokens = [
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  },
  {
    id: 'matic',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  },
];

// Token list for receiving
const receiveTokens = [
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
  {
    id: 'uni',
    name: 'Uniswap',
    symbol: 'UNI',
    icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
  },
  {
    id: 'link',
    name: 'Chainlink',
    symbol: 'LINK',
    icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
  },
];

export default function TokenSwap({ mode }: { mode: 'buy' | 'sell' }) {
  // TODO set pay and receive tokens lists based on mode
  const { authenticated } = usePrivy();
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [payToken, setPayToken] = useState(payTokens[0]);
  const [receiveToken, setReceiveToken] = useState<
    (typeof receiveTokens)[0] | null
  >(null);
  const [showFees, setShowFees] = useState(false);

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPayAmount(value);
      // Calculate the receive amount based on exchange rates
      setReceiveAmount(value);
    }
  };

  const handleReceiveAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setReceiveAmount(value);
      // Calculate the pay amount based on exchange rates
      setPayAmount(value);
    }
  };

  const handleConnectWallet = () => {
    console.log('Connect wallet');
  };

  const handleSwap = () => {
    console.log('Swap');
  };

  const calculateSwapFee = () => {
    const payAmountFloat = Number.parseFloat(payAmount) || 0;
    return payAmountFloat * 0;
  };

  return (
    <Card className="w-full max-w-md mx-auto h-fit bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-4">
          <Repeat className="h-6 w-6 text-purple-500" />
          <h2 className="text-xl font-semibold">Buy model token</h2>
        </div>
        {/* <Button variant="ghost" size="sm" className="text-gray-500">
          <Settings className="h-5 w-5" />
        </Button> */}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* You pay section */}
        <div className="bg-slate-50 rounded-lg p-4 mb-1">
          <div className="text-sm text-gray-500 mb-2">You pay</div>
          <div className="flex items-center gap-4 justify-between">
            <Input
              type="text"
              value={payAmount}
              onChange={handlePayAmountChange}
              className="text-3xl md:text-2xl font-light border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 h-auto w-36"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={payToken.icon || '/placeholder.svg'}
                      alt={payToken.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span>{payToken.symbol}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 p-1">
                {payTokens.map((token) => (
                  <DropdownMenuItem
                    key={token.id}
                    onClick={() => setPayToken(token)}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <Image
                      src={token.icon || '/placeholder.svg'}
                      alt={token.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>{token.symbol}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
        <div className="bg-slate-50 rounded-lg p-4 mt-1">
          <div className="text-sm text-gray-500 mb-2">You receive</div>
          <div className="flex items-center gap-4 justify-between">
            <Input
              type="text"
              value={receiveAmount}
              onChange={handleReceiveAmountChange}
              className="text-3xl md:text-2xl  font-light border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  } rounded-full px-3 py-1 h-auto w-36`}
                >
                  {receiveToken ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Image
                          src={receiveToken.icon || '/placeholder.svg'}
                          alt={receiveToken.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span>{receiveToken.symbol}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </>
                  ) : (
                    <span>Select token</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 p-1">
                {receiveTokens.map((token) => (
                  <DropdownMenuItem
                    key={token.id}
                    onClick={() => setReceiveToken(token)}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <Image
                      src={token.icon || '/placeholder.svg'}
                      alt={token.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>{token.symbol}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Fees section */}
        {authenticated && (
          <div className="mt-3">
            <Button
              onClick={() => setShowFees(!showFees)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-gray-500">
                <Info className="h-4 w-4" />
                <span>Swap details</span>
              </div>
              {showFees ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </Button>

            {/* Expandable fees content */}
            {showFees && (
              <div className="mt-1 p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Swap fee (0.3%)</span>
                  <span className="font-medium">
                    {calculateSwapFee()} {payToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Estimated gas</span>
                  <span className="font-medium">~0.0005 {payToken.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Price impact</span>
                  <span className="font-medium text-green-500">
                    {payAmount &&
                    receiveAmount &&
                    Number.parseFloat(payAmount) > 0
                      ? '< 0.01%'
                      : '0.00%'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Minimum received</span>
                  <span className="font-medium">
                    {receiveAmount && Number.parseFloat(receiveAmount) > 0
                      ? (Number.parseFloat(receiveAmount) * 0.995).toFixed(6)
                      : '0'}{' '}
                    {receiveToken?.symbol || ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Connect wallet button */}
        <Button
          className="w-full mt-4 bg-purple-500 hover:bg-purple-400 text-white py-6 rounded-xl text-lg font-medium"
          onClick={authenticated ? handleSwap : handleConnectWallet}
        >
          {authenticated ? 'Swap' : 'Connect wallet'}
        </Button>
      </CardContent>
    </Card>
  );
}
