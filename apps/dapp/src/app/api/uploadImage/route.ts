import crypto from 'node:crypto';
import { supabaseServiceRoleClient } from '@/lib/supabase/serviceRoleClient';
import { type NextRequest, NextResponse } from 'next/server';

const supabase = supabaseServiceRoleClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided in the request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Generate hash from file content
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Get file extension and create filename with hash
    const fileExtension = file.name.split('.').pop();
    const fileName = `${hash}.${fileExtension}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('token-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false, // Changed to true to allow overwriting if same file is uploaded
      });

    if (error) {
      if (error.message !== 'The resource already exists') {
        console.error('Supabase upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('token-images').getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
