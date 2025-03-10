import { supabaseServiceRoleClient } from '@/lib/supabase/serviceRoleClient';
import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const supabase = supabaseServiceRoleClient();

export async function POST(request: NextRequest) {
  try {
    console.log('Received image upload request');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided in the request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(
      `File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`
    );

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    console.log(`Generated filename: ${fileName}`);

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    console.log(`Converted file to buffer of length: ${buffer.length}`);

    // Upload to Supabase
    console.log('Uploading to Supabase bucket: token-images');
    const { data, error } = await supabase.storage
      .from('token-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('File uploaded successfully to Supabase');

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('token-images').getPublicUrl(fileName);

    console.log(`Generated public URL: ${publicUrl}`);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
