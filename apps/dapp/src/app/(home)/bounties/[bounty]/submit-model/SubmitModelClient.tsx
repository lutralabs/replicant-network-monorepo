'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetBounty } from '@/hooks/useGetBounty';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Predefined model options with random hashes
const MODEL_OPTIONS = [
  {
    id: '0x8a24eb2a8b8ead2963af28186e6625de8b5c89c263ca1c6756bfb351615d2437',
    name: 'GPT-4 Large Model',
    url: 'https://storage.replicant.network/models/gpt4-large',
  },
  {
    id: '0x3f6c2e0b6deed94ed4bc76a42f5c30b2c7c879352df9a7b503317a7c3fe90cd7',
    name: 'Stable Diffusion XL',
    url: 'https://storage.replicant.network/models/sdxl',
  },
];

export const SubmitModelClient = () => {
  const [selectedModel, setSelectedModel] = useState('');
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
    if (!selectedModel) {
      setError('Please select a model');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const wallet = wallets[0];
      const address = wallet.address;

      // Find the selected model details
      const modelDetails = MODEL_OPTIONS.find(
        (model) => model.id === selectedModel
      );

      if (!modelDetails) {
        throw new Error('Selected model not found');
      }

      // Message to sign - include the model ID and URL in the message
      const message = `I'm submitting model ${modelDetails.name} (${selectedModel}) for bounty ID: ${bountyId}`;

      // Get provider and sign message
      const provider = await wallet.getEthereumProvider();
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Submit to API with the signature and model ID
      const response = await fetch('/api/submitModel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_address: address,
          model_hash: selectedModel,
          signature: signature,
          message: message,
          bounty_id: bountyId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSelectedModel('');
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
            Your model has been submitted successfully and will be added to the
            contract. It is now eligible for voting.
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
              Please select one of the available models to submit for this
              bounty. Your submission will be directly added to the contract and
              become eligible for voting.
            </p>
          </div>
        </>
      )}

      <div className="mb-8">
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Select Model
        </div>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model to submit" />
          </SelectTrigger>
          <SelectContent>
            {MODEL_OPTIONS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <Button
        className="w-full md:w-auto"
        onClick={handleSubmitModel}
        disabled={isSubmitting || !selectedModel}
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
};
