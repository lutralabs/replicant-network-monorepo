import { supabaseServiceRoleClient } from '@/lib/supabase/serviceRoleClient';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the bounty ID from the query string
  const { searchParams } = new URL(request.url);
  const bountyId = searchParams.get('bountyId');

  if (!bountyId) {
    return Response.json({ message: 'Bounty ID is required' }, { status: 400 });
  }

  try {
    const supabase = supabaseServiceRoleClient();

    // First get all prompts for this bounty
    const { data: promptsData, error: promptsError } = await supabase
      .from('prompts')
      .select('id, prompt')
      .eq('crowdfund_id', Number(bountyId));

    if (promptsError) {
      console.error('Error fetching prompts:', promptsError);
      return Response.json(
        { message: 'Failed to fetch prompt data for this bounty' },
        { status: 500 }
      );
    }

    if (!promptsData || promptsData.length === 0) {
      return Response.json(
        { data: [], message: 'No test prompts found for this bounty' },
        { status: 200 }
      );
    }

    // Fetch all images for these prompts
    const promptIds = promptsData.map((p) => p.id);
    const { data: imagesData, error: imagesError } = await supabase
      .from('images')
      .select('*')
      .in('prompt_id', promptIds);

    if (imagesError) {
      console.error('Error fetching images:', imagesError);
      return Response.json(
        { message: 'Failed to fetch image data for this bounty' },
        { status: 500 }
      );
    }

    // Group images by prompt
    const groupedResults = promptsData.map((prompt) => {
      // Find all images for this prompt
      const promptImages = imagesData.filter(
        (img) => img.prompt_id === prompt.id
      );

      // Group images by model hash (to show side by side comparisons)
      const imagesByModel = {};
      promptImages.forEach((img) => {
        if (!imagesByModel[img.modelHash]) {
          imagesByModel[img.modelHash] = [];
        }
        imagesByModel[img.modelHash].push({
          url: img.URL,
          width: img.width,
          height: img.height,
          modelHash: img.modelHash,
        });
      });

      return {
        promptId: prompt.id,
        prompt: prompt.prompt,
        images: Object.values(imagesByModel).flat(), // Flatten the grouped images
        modelHashes: Object.keys(imagesByModel),
      };
    });

    // Filter out any prompts with no images
    const filteredResults = groupedResults.filter(
      (result) => result.images && result.images.length > 0
    );

    return Response.json({
      data: filteredResults,
      count: filteredResults.length,
    });
  } catch (error) {
    console.error('Error fetching test images:', error);
    return Response.json(
      { message: 'An unexpected error occurred while retrieving test images' },
      { status: 500 }
    );
  }
}
