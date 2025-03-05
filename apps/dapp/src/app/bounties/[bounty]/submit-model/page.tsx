'use client';
import { Button } from '@/components/ui/button';
import { useGetBounty } from '@/hooks/useGetBounty';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Page() {
  const [modelUrl, setModelUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  // Get bounty ID from URL path
  const pathname = usePathname();
  const bountyId = pathname.split('/')[2];

  // Fetch bounty data
  const { bounty, isLoading, refetch } = useGetBounty(Number(bountyId));

  // Handle personal sign and submission
  const handleSubmitModel = async () => {
    if (!modelUrl) {
      setError('Please enter a model URL');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const wallet = wallets[0];
      const address = wallet.address;

      // Message to sign - include the model URL in the message
      const message = `I'm submitting this model URL: ${modelUrl} for bounty ID: ${bountyId}`;

      // Get provider and sign message
      const provider = await wallet.getEthereumProvider();
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Submit to API with the full signature and message for verification
      const response = await fetch('/api/submitModel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_address: address,
          model_url: modelUrl,
          signature: signature,
          message: message,
          bounty_id: bountyId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setModelUrl('');
        setIsSuccess(true);

        // Refetch the bounty data to update submission count
        refetch?.();
      } else {
        throw new Error(result.error || 'Failed to submit model');
      }
    } catch (error) {
      console.error('Error submitting model:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while bounty data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // If user is not authenticated, show connect message
  if (!authenticated) {
    return (
      <div className="bg-white max-w-[1050px] rounded-lg mt-4 p-8 text-center">
        <div className="text-xl font-medium mb-4">Authentication Required</div>
        <p className="text-gray-600">
          You must be connected to your wallet to submit a model.
        </p>
      </div>
    );
  }

  // Show success message when submission is complete
  if (isSuccess) {
    return (
      <div className="bg-white max-w-[1050px] rounded-lg mt-4 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Submission Successful!</h2>
          <p className="text-gray-600 mb-8">
            Your model has been submitted successfully and will be reviewed for
            this bounty. If the model is accepted it will be added to the
            contract and become eligible for voting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push(`/bounties/${bountyId}`)}
              className="flex-1 sm:flex-grow-0"
            >
              Return to Bounty
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-[1050px] rounded-lg mt-4 p-8">
      <div className="text-2xl font-medium mb-6">Submit a Model</div>

      {bounty && (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Bounty: {bounty.title}</h3>
            <p className="text-gray-600">{bounty.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Submission Guidelines</h3>
            <p className="text-gray-600">
              Please provide a URL to your model. The URL should point to a
              publicly accessible location where reviewers can download and test
              your model. If the valuation is successful, your model will be
              added to the contract and become eligible for voting.
            </p>
          </div>
        </>
      )}

      <div className="mb-8">
        {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model URL
        </label>
        <div className="flex items-center justify-between rounded-lg border-2 border-sidebar-border pr-2">
          <input
            className="grow outline-none border-0 p-3 rounded-lg w-full"
            placeholder="https://your-model-url.com/model"
            value={modelUrl}
            onChange={(e) => setModelUrl(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <Button
        className="w-full md:w-auto"
        onClick={handleSubmitModel}
        disabled={isSubmitting || !modelUrl}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit Model <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
