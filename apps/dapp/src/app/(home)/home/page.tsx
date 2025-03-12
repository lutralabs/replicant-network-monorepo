'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Brain, LayoutGrid, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BountiesClient() {
  const router = useRouter();
  // Intent selection UI
  const IntentSelectionUI = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 relative"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-purple-50/30 to-transparent -z-10" />
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-100/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl -z-10" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-purple-700"
      >
        What would you like to do?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 text-center mb-16 max-w-2xl text-lg"
      >
        Select an option below to find the most relevant bounties for your needs
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {[
          {
            intent: 'fund',
            icon: <Wallet size={32} strokeWidth={1.5} />,
            title: 'Fund Model Bounties',
            description:
              'Contribute to exciting bounties, help bring innovative ideas to life and earn rewards in return',
            color: 'blue',
          },
          {
            intent: 'submit',
            icon: <Brain size={32} strokeWidth={1.5} />,
            title: 'Submit a Model',
            description:
              'Showcase your expertise by submitting models to open bounties and earn rewards',
            color: 'purple',
          },
          {
            intent: null,
            icon: <LayoutGrid size={32} strokeWidth={1.5} />,
            title: 'Browse All Bounties',
            description:
              'Explore the full marketplace of active and past bounties',
            color: 'green',
          },
        ].map((option, index) => (
          <motion.button
            key={option.intent}
            onClick={() =>
              router.push(
                `/bounties${option.intent ? '?intent=' : ''}${option.intent || ''}`
              )
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + index * 0.1 }}
            className={
              'group hover:cursor-pointer p-0 rounded-2xl transition-all flex flex-col items-center overflow-hidden'
            }
          >
            <div
              className={cn(
                'w-full h-full p-8 bg-white border rounded-2xl relative overflow-hidden group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300',
                `border-${option.color}-100 group-hover:shadow-${option.color}-100/50`
              )}
            >
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  `from-${option.color}-50 to-${option.color}-100/50`
                )}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    'p-4 bg-gradient-to-br rounded-2xl mb-6 text-white shadow-lg group-hover:scale-110 transition-all duration-300',
                    `from-${option.color}-300 to-${option.color}-400 shadow-${option.color}-200 group-hover:shadow-${option.color}-300`
                  )}
                >
                  {option.icon}
                </div>
                <h3
                  className={cn(
                    'text-xl font-semibold mb-4 transition-colors',
                    `text-${option.color}-900 group-hover:text-${option.color}-700`
                  )}
                >
                  {option.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <Link href={'/bounties/bounty-form'}>
          <Button variant="outline" className="px-6 py-2 text-base font-medium">
            Create Your Own Bounty
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="w-full h-full">
      <IntentSelectionUI />
    </div>
  );
}

// Explicitly include the color classes to ensure Tailwind CSS includes them in the final CSS bundle
const colorClasses = `
  border-blue-100 group-hover:shadow-blue-100/50
  border-purple-100 group-hover:shadow-purple-100/50
  border-green-100 group-hover:shadow-green-100/50
  from-blue-50 to-blue-100/50
  from-purple-50 to-purple-100/50
  from-green-50 to-green-100/50
  from-blue-300 to-blue-400 shadow-blue-200 group-hover:shadow-blue-300
  from-purple-300 to-purple-400 shadow-purple-200 group-hover:shadow-purple-300
  from-green-300 to-green-400 shadow-green-200 group-hover:shadow-green-300
  text-blue-900 group-hover:text-blue-700
  text-purple-900 group-hover:text-purple-700
  text-green-900 group-hover:text-green-700
`;
