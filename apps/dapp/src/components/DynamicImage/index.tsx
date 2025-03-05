import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

export function DynamicImage({ src, alt, width, height }) {
  const [imageSrc, setImageSrc] = useState('/placeholder.png');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(src);
        if (response.ok) {
          setImageSrc(src);
          setLoading(false);
        }
      } catch (error) {
        console.log('Waiting for image generation...');
      }
    };
    setLoading(true);
    const interval = setInterval(checkImage, 1000); // Check every second
    return () => clearInterval(interval);
  }, [src]);

  if (loading) return <Skeleton className="w-[512px] h-[512px] rounded-lg" />;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      className="rounded-lg"
      height={height}
    />
  );
}
