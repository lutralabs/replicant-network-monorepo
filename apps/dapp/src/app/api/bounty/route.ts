import type { NextRequest } from 'next/server';
import { supabaseServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

// Get bounty metadata from Supabase
export async function GET(request: NextRequest) {
  // Get bounty ID from URL params
  const { searchParams } = new URL(request.url);
  const bountyId = searchParams.get('id');

  if (!bountyId) {
    return Response.json({ error: 'Bounty ID is required' }, { status: 400 });
  }

  const supabase = supabaseServiceRoleClient();

  // Fetch metadata from Supabase using the bounty ID
  const { data: supabaseData, error } = await supabase
    .from('crowdfund')
    .select('*')
    .eq('id', Number(bountyId))
    .single();

  if (error) {
    console.warn(`No Supabase data found for bounty ${bountyId}:`, error);
    return Response.json(
      { error: 'Bounty metadata not found' },
      { status: 404 }
    );
  }

  return Response.json({ data: supabaseData });
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'target_amount'];
    for (const field of requiredFields) {
      if (!requestBody[field]) {
        return Response.json(
          { error: `Field '${field}' is required` },
          { status: 400 }
        );
      }
    }

    const supabase = supabaseServiceRoleClient();

    // Prepare data object with all potential fields
    const bountyData = {
      title: requestBody.title,
      description: requestBody.description,
      target_amount: requestBody.target_amount,
      current_amount: requestBody.current_amount || 0,
      deadline: requestBody.deadline,
      creator_address: requestBody.creator_address,
      status: requestBody.status || 'active',
      category: requestBody.category,
      image_url: requestBody.image_url,
      metadata: requestBody.metadata,
      // Required fields according to schema
      prompters: requestBody.prompters || [],
      type: requestBody.type || 'crowdfund',
      // Any additional fields should be added here
    };

    // Insert new bounty into the database
    const { data, error } = await supabase
      .from('crowdfund')
      .insert(bountyData)
      .select()
      .single();

    if (error) {
      console.error('Error creating bounty:', error);
      return Response.json(
        { error: 'Failed to create bounty' },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
