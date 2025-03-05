'use client';
import { BountyInfo } from '@/components/BountyInfo';
import { DynamicImage } from '@/components/DynamicImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { FormControl } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BOUNTIES } from '@/constants/bounties';
import { useWallets } from '@privy-io/react-auth';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const testData = [
  {
    prompt: 'A picture of a cat',
    images: [
      {
        width: 256,
        height: 256,
        url: 'https://vucmbzcjyxbxaapykklr.supabase.co/storage/v1/object/public/generated-images//0fc58bd1-7115-444a-9141-0f37bdd40219',
      },
      {
        width: 256,
        height: 256,
        url: 'https://vucmbzcjyxbxaapykklr.supabase.co/storage/v1/object/public/generated-images//120e6038-7fd3-4774-b577-7a29c53be148_0_1867011560.png',
      },
    ],
  },
  {
    prompt: 'A picture of a dog',
    images: [
      {
        width: 256,
        height: 256,
        url: 'https://vucmbzcjyxbxaapykklr.supabase.co/storage/v1/object/public/generated-images//1a660434-b14f-45fc-a237-8f7694adacba',
      },
      {
        width: 256,
        height: 256,
        url: 'https://vucmbzcjyxbxaapykklr.supabase.co/storage/v1/object/public/generated-images//1fc98805-32de-4643-b82a-e140723e7cf3',
      },
    ],
  },
];

//Get all images from the DB

export default function Page() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  const slug = pathNames[pathNames.length - 2];

  const bounty = BOUNTIES.find((bounty) => bounty.id === slug);

  if (bounty.status !== 'voting') {
    return <div>Not in voting phase</div>;
  }
  return (
    <div className="w-full">
      {/* <BountyInfo bounty={bounty} /> */}
      <div className="px-12">
        <Carousel className="w-full">
          <CarouselContent>
            {testData.map((data) => (
              <CarouselItem key={data.prompt}>
                <div className="flex flex-wrap gap-x-12 gap-y-12 justify-center mt-12">
                  {data.images?.map((_image, modelId) => (
                    <div
                      key={_image.url}
                      className="flex flex-col items-center gap-y-2"
                    >
                      <DynamicImage
                        alt="generated image"
                        height={_image.height}
                        width={_image.width}
                        src={_image.url}
                      />
                      <div>Model {modelId + 1}</div>
                    </div>
                  ))}
                </div>
                <div className=" flex justify-center items-center mt-8 gap-x-2 text-md text-gray-600 font-medium">
                  Prompt:
                  <span className="text-lg text-black font-semibold">
                    {data.prompt}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="mt-12">
        <Label>Vote for Model</Label>
        <Select defaultValue={'1'}>
          <SelectTrigger>
            <SelectValue placeholder={'Vote for a Model'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Model 1</SelectItem>
            <SelectItem value="2">Model 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
