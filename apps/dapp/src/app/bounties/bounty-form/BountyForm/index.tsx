'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallets } from '@privy-io/react-auth';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useBalance } from 'wagmi';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SmartDatetimeInput } from '@/components/ui/smart-datetime-input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBounty } from '@/hooks/useCreateBounty';
import { formatBalance } from '@/lib/utils';
import { config } from '@/wagmi';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  symbol: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .max(3, {
      message: 'Title must be at most 3 characters.',
    }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  email: z
    .string()
    .min(2, {
      message: 'Email must be at least 2 characters.',
    })
    .email()
    .optional(),
  discord: z
    .string()
    .min(2, {
      message: 'Discord must be at least 2 characters.',
    })
    .optional(),
  telegram: z
    .string()
    .min(2, {
      message: 'Telegram must be at least 2 characters.',
    })
    .optional(),
  endOfFunding: z.date({
    required_error: 'End Date of Funding is required',
  }),
  endOfSubmissions: z.date({
    required_error: 'End Date of Model Submissions is required',
  }),
  endOfVoting: z.date({
    required_error: 'End Date of Voting is required',
  }),
  maxAmount: z.coerce
    .number()
    .int()
    .positive({
      message: 'Maximum amount must be a positive number.',
    })
    .optional(),
  devFees: z.coerce
    .number()
    .int()
    .positive({
      message: 'Maximum amount must be a positive number.',
    })
    .min(0, {
      message: 'Dev Fees must be a positive number.',
    })
    .max(100, {
      message: 'Dev Fees must be less than 100.',
    }),
  contribution: z.coerce
    .number()
    .positive({
      message: 'Maximum amount must be a positive number.',
    })
    .min(0.001),
});

export const BountyForm = () => {
  const router = useRouter();
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Replace this with your desired wallet

  const balance = useBalance({
    address: (wallet?.address ?? '0x0') as `0x${string}`,
    config,
  });

  const { mutate: createBounty } = useCreateBounty();

  const formattedBalance = useMemo(() => {
    if (!balance || !balance.data) return 0;
    return formatBalance(balance.data.value);
  }, [balance.data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      symbol: '',
      description: '',
      email: undefined,
      discord: undefined,
      telegram: undefined,
      endOfFunding: undefined,
      endOfSubmissions: undefined,
      endOfVoting: undefined,
      maxAmount: undefined,
      devFees: undefined,
      contribution: undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    if (
      values.endOfFunding >= values.endOfSubmissions ||
      values.endOfSubmissions >= values.endOfVoting
    ) {
      console.log('Invalid dates');
    }

    const res = createBounty(
      {
        amount: values.contribution,
        title: values.title,
        symbol: values.symbol,
        fundingPhaseEnd: Math.round(values.endOfFunding.getTime() / 1000),
        submissionPhaseEnd: Math.round(
          values.endOfSubmissions.getTime() / 1000
        ),
        votingPhaseEnd: Math.round(values.endOfVoting.getTime() / 1000),
        developerFeePercentage: values.devFees,
        raiseCap: values.maxAmount,
        description: values.description,
        discord: values.discord,
        email: values.email,
        telegram: values.telegram,
      },
      {
        onSuccess: (data) => {
          if (data) {
            router.push(`/bounties/${data.bountyData.id}`);
          }
        },
      }
    );
    console.log(res);
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>
                Title
              </FormLabel>
              <FormControl>
                <Input required placeholder="Title of the Model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>
                Symbol
              </FormLabel>
              <FormControl>
                <Input required placeholder="Symbol of the Model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>
            <span className="text-red-500">*</span>Type
          </FormLabel>
          <Select disabled defaultValue={'image'}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={'Image Generator'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="image">Image Generator</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Only Image Generation is supported at the moment.
          </FormDescription>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>Model Description
              </FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder={`Introduction to the Problem: Provide a clear explanation of the issue. \n
  - Provide details about the issues model needs to solve
  - Provide access to data, if Applicable
  - Provide examples of expected results`}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The more information you provide, the higher chance of a
                successful bounty.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-x-12">
          <FormItem>
            <FormLabel>
              <span className="text-red-500">*</span>Type of Input
            </FormLabel>
            <Select disabled defaultValue={'image'}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={'Image Generator'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="image">Text</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              When would you like the crowdfunding period of your model to end.
            </FormDescription>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>
              <span className="text-red-500">*</span>Base Model
            </FormLabel>
            <Select disabled defaultValue={'image'}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={'Image Generator'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="image">Solar Eclipse</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Which model do you want to use as a base?
            </FormDescription>
            <FormMessage />
          </FormItem>
        </div>
        <div className="h-[8px]" />
        <FormLabel className="text-lg">Contact Information</FormLabel>
        <div className="mt-4 flex w-full gap-x-12">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>
                  <div>Email</div>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email Address"
                    required={false}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discord"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>
                  <div>Discord</div>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Discord Handle"
                    required={false}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>
                  <div>Telegram</div>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Telegram Handle"
                    required={false}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="h-[8px]" />
        <FormLabel className="text-lg">Bounty Timeline</FormLabel>
        <div className="mt-4 flex w-full gap-x-12">
          <FormField
            control={form.control}
            name="endOfFunding"
            render={({ field }) => (
              <FormItem className="flex grow flex-col">
                <FormLabel>
                  <span className="text-red-500">*</span>Funding Period
                </FormLabel>
                <SmartDatetimeInput
                  disabled={(date) =>
                    date < new Date() ||
                    date > form.getValues('endOfSubmissions')
                  }
                  name="endOfFunding"
                  placeholder="e.g. tomorrow at 3pm"
                  value={field.value}
                  // onChange={field.onChange}
                  onValueChange={field.onChange}
                />
                <FormDescription>
                  Time when the funding period ends.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endOfSubmissions"
            render={({ field }) => (
              <FormItem className="flex grow flex-col">
                <FormLabel>
                  <span className="text-red-500">*</span>Submissions Period
                </FormLabel>
                <SmartDatetimeInput
                  disabled={(date) =>
                    date < new Date() ||
                    date < form.getValues('endOfFunding') ||
                    date > form.getValues('endOfVoting')
                  }
                  name="endOfSubmissions"
                  placeholder="e.g. tomorrow at 3pm"
                  value={field.value}
                  // onChange={field.onChange}
                  onValueChange={field.onChange}
                />
                <FormDescription>
                  Time when the submissions period ends.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endOfVoting"
            render={({ field }) => (
              <FormItem className="flex grow flex-col">
                <FormLabel>
                  <span className="text-red-500">*</span>Voting Period
                </FormLabel>
                <SmartDatetimeInput
                  disabled={(date) =>
                    date < new Date() ||
                    date < form.getValues('endOfSubmissions')
                  }
                  name="endOfVoting"
                  placeholder="e.g. tomorrow at 3pm"
                  value={field.value}
                  // onChange={field.onChange}
                  onValueChange={field.onChange}
                />
                <FormDescription>
                  Time when the voting period ends.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="maxAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div>Maximum Amount</div>
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Maximum amount of MON collected for this bounty.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="devFees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div>
                  <span className="text-red-500">*</span>Developer Fees
                </div>
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Percent of total supply that will go to developer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div>
                  <span className="text-red-500">*</span>Your Contribution
                </div>
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                <div className="flex w-full justify-between">
                  Amount of MON you will contribute to the bounty.
                  <div className="flex items-center gap-x-2">
                    {formattedBalance} MON
                    <Button
                      size="sm"
                      type="button"
                      variant="cta-solid"
                      onClick={() => {
                        form.setValue('contribution', formattedBalance);
                      }}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full justify-end">
          <Button type="submit" variant="cta-solid">
            Create Bounty
          </Button>
        </div>
      </form>
    </Form>
  );
};
