import {
  type ConnectedWallet,
  usePrivy,
  useWallets,
} from '@privy-io/react-auth';

import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export function LoginButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);
  const wallet = wallets[0]; // Replace this with your desired wallet

  const switchChain = async (wallet: ConnectedWallet) => {
    await wallet.switchChain(10143);
  };

  if (ready && authenticated && wallet) {
    const chainId = wallet.chainId;
    return (
      <div className="flex items-center gap-x-2">
        <div
          className={cn(
            'inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-1.5 text-sm font-medium text-white shadow-md'
          )}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-mono">{wallet.address.slice(0, 6)}</span>
            <span className="text-violet-300">•••</span>
            <span className="font-mono">{wallet.address.slice(-4)}</span>
          </div>
        </div>
        {chainId !== 'eip155:10143' && (
          <Button
            variant="secondary"
            onClick={() => {
              switchChain(wallet);
            }}
          >
            Wrong Chain
          </Button>
        )}
        <Button size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button disabled={disableLogin} variant="cta-solid" onClick={login}>
      Log in
    </Button>
  );
}
