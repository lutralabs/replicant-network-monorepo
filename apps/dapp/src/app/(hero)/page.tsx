'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function Page() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      'Image Generation',
      'Chat Bots',
      'Trading Agent',
      'Predictions',
      'Analyzing',
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="z-[1000] fixed top-0 left-0 h-screen bg-slate-100 w-screen overflow-hidden">
      <div className="w-full">
        <div className="container mx-auto">
          <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
            <div>
              <Link href="https://discord.gg/jj9K9UJwa7">
                <Button variant="outline" size="sm" className="gap-4">
                  Join our Community <MoveRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
                <span className="text-spektr-cyan-50">
                  Custom AI Models for
                </span>
                <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                  &nbsp;
                  {titles.map((title, index) => (
                    <motion.span
                      key={title}
                      className="absolute font-semibold"
                      initial={{ opacity: 0, y: '-100' }}
                      transition={{ type: 'spring', stiffness: 50 }}
                      animate={
                        titleNumber === index
                          ? {
                              y: 0,
                              opacity: 1,
                            }
                          : {
                              y: titleNumber > index ? -150 : 150,
                              opacity: 0,
                            }
                      }
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                Creating custom models is challenging for most individuals and
                businesses. Avoid further complications by avoiding expensive,
                time consuming and highly technological work. Our goal is to
                streamline Custom AI trade, making it easier and faster than
                ever.
              </p>
            </div>
            <div className="flex flex-row gap-3">
              <Link href="/models">
                <Button size="lg" className="gap-4" variant="default">
                  Try Winning Models
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="cta-gradient" size="lg" className="gap-4">
                  Check out Bounties <MoveRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
