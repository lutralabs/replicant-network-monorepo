import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '../ui/button';

export function LoginButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);
  const wallet = wallets[0]; // Replace this with your desired wallet

  const switchChain = async (wallet: any) => {
    await wallet.switchChain(10143);
  };

  if (ready && authenticated && wallet) {
    const chainId = wallet.chainId;
    return (
      <div>
        {wallet.address}
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
        <Button onClick={logout}>Logout</Button>
      </div>
    );
  }

  return (
    <Button disabled={disableLogin} onClick={login}>
      Log in
    </Button>
  );
}
