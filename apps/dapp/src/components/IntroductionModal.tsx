'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { SiDiscord } from '@icons-pack/react-simple-icons';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Rocket, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'replicant-intro-seen';
const MAIN_ROUTES = ['/home', '/models', '/bounties'];

// Custom DialogContent without the close button
function CustomDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function IntroductionModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const pathname = usePathname();

  useEffect(() => {
    // Only show on main routes and if user hasn't seen it before
    if (MAIN_ROUTES.includes(pathname)) {
      const hasSeenIntro = localStorage.getItem(STORAGE_KEY) === 'true';
      if (!hasSeenIntro) {
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  }, [pathname]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
    setStep(1); // Reset to first step when closed
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const steps = [
    {
      title: 'Welcome to Replicant Network',
      subtitle: 'An decentralized Custom AI Model Marketplace',
      content: (
        <div className="space-y-6 my-4">
          <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              This is an alpha testnet environment where you can explore, test,
              and provide feedback.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Key Features',
      subtitle: 'Explore what Replicant Network has to offer',
      content: (
        <div className="space-y-6 my-6">
          <FeatureItem
            icon={<Rocket className="h-5 w-5 text-emerald-500" />}
            title="Participate in Bounties"
            description="Test our complete bounty workflow from start to finish"
          />

          <FeatureItem
            icon={<LayoutDashboard className="h-5 w-5 text-blue-500" />}
            title="Browse Winning AI Models"
            description="Explore AI models that won bounties"
          />

          <FeatureItem
            icon={<Zap className="h-5 w-5 text-amber-500" />}
            title="Try Models & Vote"
            description="Test submitted models and vote for the best ones as part of the bounty lifecycle"
          />
        </div>
      ),
    },
    {
      title: 'Testnet Environment',
      subtitle: 'Important limitations to know',
      content: (
        <div className="space-y-6 my-4">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-600 mb-4">
              Due to hardware constraints, you can't submit or test actual
              models. This environment is designed to demonstrate the bounty
              flow through all phases.
            </p>

            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <SiDiscord className="h-5 w-5 text-indigo-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  We'd love your feedback!
                </p>
                <Link
                  href="https://discord.gg/jj9K9UJwa7"
                  target="_blank"
                  className="text-xs text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Join our Discord community
                </Link>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Only allow closing through the buttons
        if (!isOpen) return;
      }}
    >
      <CustomDialogContent className="p-0 border-0 overflow-hidden rounded-3xl max-w-md mx-auto shadow-xl">
        <div className="bg-white text-gray-800 rounded-3xl border border-gray-100 overflow-hidden">
          {/* Progress indicators */}
          <div className="flex justify-center gap-1.5 absolute top-4 left-1/2 transform -translate-x-1/2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i + 1 <= step ? 'bg-blue-500 w-6' : 'bg-gray-200 w-4'
                }`}
              />
            ))}
          </div>

          {/* Content area with animations */}
          <div className="pt-12 px-6 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {steps[step - 1].title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {steps[step - 1].subtitle}
                </p>

                {steps[step - 1].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50">
            {step > 1 ? (
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                onClick={prevStep}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0 px-6"
              onClick={nextStep}
            >
              {step < totalSteps ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
      <div className="flex-shrink-0 rounded-full bg-white p-2.5 shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
