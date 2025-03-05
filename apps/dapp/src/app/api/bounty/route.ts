import { supabaseServiceRoleClient } from '@/lib/supabase/serviceRoleClient';
import type { NextRequest } from 'next/server';

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
    const requiredFields = ['id', 'title', 'description'];
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
      id: requestBody.id,
      title: requestBody.title,
      description: requestBody.description,
      type: null,
      discord: requestBody.discord || null,
      email: requestBody.email || null,
      telegram: requestBody.telegram || null,
    };

    console.log('storing in DB', bountyData);

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
