import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import {
  readContract,
  simulateContract,
  verifyMessage,
  writeContract,
} from '@wagmi/core';
import type { NextRequest } from 'next/server';
import { privateKeyToAccount } from 'viem/accounts';

const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

/**
 * Handle POST requests to submit a new model to the contract
 */
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    // Validate required fields
    const requiredFields = [
      'owner_address',
      'model_hash',
      'signature',
      'message',
      'bounty_id',
    ];
    for (const field of requiredFields) {
      if (!requestBody[field]) {
        return Response.json(
          { error: `Field '${field}' is required` },
          { status: 400 }
        );
      }
    }

    const { owner_address, model_hash, signature, message, bounty_id } =
      requestBody;

    // Step 1: Verify the signed message
    const isValidSignature = await verifyMessage(config, {
      address: owner_address,
      message,
      signature,
    });

    if (!isValidSignature) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Step 2: Verify that the model hash in the message matches the submitted hash
    if (!message.includes(model_hash)) {
      return Response.json(
        { error: 'Signature does not match the provided model hash' },
        { status: 401 }
      );
    }

    // Step 3: Verify that the bounty ID in the message matches the submitted ID
    if (!message.includes(`bounty ID: ${bounty_id}`)) {
      return Response.json(
        { error: 'Signature does not match the provided bounty ID' },
        { status: 401 }
      );
    }

    // Step 4: Setup wallet with private key for contract interaction
    const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

    // Step 5: Submit the model directly to the contract
    // Convert model_hash to proper bytes32 if needed
    const modelHashBytes32 = model_hash as `0x${string}`;

    try {
      // Check if the model is already submitted
      try {
        const submission = await readContract(config, {
          address: process.env.CONTRACT_ADDRESS as `0x${string}`,
          abi: repNetManagerAbi,
          functionName: 'submission',
          args: [BigInt(bounty_id), modelHashBytes32],
        });

        // If we can fetch the submission and it has a timestamp > 0, it already exists
        if (submission && submission.timestamp > 0) {
          return Response.json(
            {
              success: false,
              message: 'Model has already been submitted for this bounty',
              data: {
                bounty_id: bounty_id,
                model_hash: model_hash,
                owner_address: owner_address,
              },
            },
            { status: 409 }
          ); // 409 Conflict for duplicate resource
        }
      } catch (checkError) {
        // If there's an error reading the submission (like if it doesn't exist),
        // we continue with the submission attempt
        console.log(
          'Submission check resulted in error, proceeding with submission:',
          checkError
        );
      }

      const result = await simulateContract(config, {
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        abi: repNetManagerAbi,
        functionName: 'submit',
        args: [
          BigInt(bounty_id),
          modelHashBytes32,
          owner_address as `0x${string}`,
        ],
        account,
      });

      const hash = await writeContract(config, result.request as any);

      console.log('Model submitted to contract, transaction hash:', hash);

      // Return success response with the created data
      return Response.json({
        success: true,
        message: 'Model submitted successfully to contract',
        data: {
          transaction_hash: hash,
          bounty_id: bounty_id,
          model_hash: model_hash,
          owner_address: owner_address,
        },
      });
    } catch (contractError) {
      // Check if the error is because the model was already submitted
      if (contractError.toString().includes('SolutionAlreadySubmitted')) {
        return Response.json(
          {
            success: false,
            message: 'Model has already been submitted for this bounty',
            data: {
              bounty_id: bounty_id,
              model_hash: model_hash,
              owner_address: owner_address,
            },
          },
          { status: 409 }
        );
      }

      console.error('Error submitting to contract:', contractError);
      return Response.json(
        { error: 'Failed to submit model to contract' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error during model submission:', error);
    return Response.json(
      {
        error: 'Internal server error while processing model submission',
      },
      { status: 500 }
    );
  }
}
