'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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
import { ErrorToast } from '@/components/Toast/ErrorToast';
import { SuccessToast } from '@/components/Toast/SuccessToast';
import { useCreateBounty } from '@/hooks/useCreateBounty';
import { formatBalance } from '@/lib/utils';
import { config } from '@/wagmi';
import { Loader2, Calendar, Mail, MessageSquare, Send } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  symbol: z
    .string()
    .min(2, {
      message: 'Symbol must be at least 2 characters.',
    })
    .max(3, {
      message: 'Symbol must be at most 3 characters.',
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
  const [isCreating, setIsCreating] = useState(false);
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
      contribution: 0.001,
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
      ErrorToast({
        error: 'Invalid dates sequence. Please check your timeline.',
      });
      return;
    }

    setIsCreating(true);

    try {
      createBounty(
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
          onSuccess: () => {
            SuccessToast({
              message: 'Your bounty has been created successfully!',
            });
            setTimeout(() => {
              router.push('/bounties');
            }, 1500);
          },
          onError: (error) => {
            ErrorToast({ error: error.message });
          },
          onSettled: () => {
            setIsCreating(false);
          },
        }
      );
    } catch (error) {
      ErrorToast({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
      setIsCreating(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-2 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              Create New Bounty
            </CardTitle>
            <CardDescription>
              Create a new bounty to fund AI model development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-red-500 mr-1">*</span>
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Title of the Model"
                        {...field}
                        className="transition-all focus-visible:ring-1 focus-visible:ring-purple-500"
                      />
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
                      <span className="text-red-500 mr-1">*</span>
                      Symbol
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Symbol of the Model"
                        {...field}
                        className="transition-all focus-visible:ring-1 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>
                <span className="text-red-500 mr-1">*</span>
                Type
              </FormLabel>
              <Select disabled defaultValue={'image'}>
                <FormControl>
                  <SelectTrigger className="transition-all focus-visible:ring-1 focus-visible:ring-purple-500">
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
                    <span className="text-red-500 mr-1">*</span>
                    Model Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none min-h-32 transition-all focus-visible:ring-1 focus-visible:ring-purple-500"
                      placeholder={`Provide a clear explanation of the AI model you want. \n
- Provide details about the issues model needs to solve
- Provide access to data, if applicable
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>
                  <span className="text-red-500 mr-1">*</span>
                  Type of Input
                </FormLabel>
                <Select disabled defaultValue={'image'}>
                  <FormControl>
                    <SelectTrigger className="transition-all focus-visible:ring-1 focus-visible:ring-purple-500">
                      <SelectValue placeholder={'Image Generator'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="image">Text</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  What kind of input do you want to use?
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>
                  <span className="text-red-500 mr-1">*</span>
                  Base Model
                </FormLabel>
                <Select disabled defaultValue={'image'}>
                  <FormControl>
                    <SelectTrigger className="transition-all focus-visible:ring-1 focus-visible:ring-purple-500">
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
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact
            </CardTitle>
            <CardDescription>
              How can developers reach you about this bounty?
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>Discord</FormLabel>
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
                    <FormLabel>Telegram</FormLabel>
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
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
            <CardDescription>
              Set the timeline for your bounty's funding, submissions, and
              voting periods
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="endOfFunding"
                render={({ field }) => (
                  <FormItem className="flex grow flex-col">
                    <FormLabel>
                      <span className="text-red-500 mr-1">*</span>
                      Funding Period
                    </FormLabel>
                    <SmartDatetimeInput
                      disabled={(date) =>
                        date < new Date() ||
                        date > form.getValues('endOfSubmissions')
                      }
                      name="endOfFunding"
                      placeholder="e.g. tomorrow at 3pm"
                      value={field.value}
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
                      <span className="text-red-500 mr-1">*</span>
                      Submissions Period
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
                      <span className="text-red-500 mr-1">*</span>
                      Voting Period
                    </FormLabel>
                    <SmartDatetimeInput
                      disabled={(date) =>
                        date < new Date() ||
                        date < form.getValues('endOfSubmissions')
                      }
                      name="endOfVoting"
                      placeholder="e.g. tomorrow at 3pm"
                      value={field.value}
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
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Funding
            </CardTitle>
            <CardDescription>
              Set the funding parameters for your bounty
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="maxAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Amount</FormLabel>
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
                      <span className="text-red-500 mr-1">*</span>
                      Developer Fees
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
            </div>

            <FormField
              control={form.control}
              name="contribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-red-500 mr-1">*</span>
                    Your Contribution
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled={isCreating} />
                  </FormControl>
                  <FormDescription>
                    <div className="flex w-full justify-between">
                      Amount of MON you will contribute to the bounty.
                      <div className="flex items-center gap-x-2">
                        {formattedBalance} MON
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            form.setValue('contribution', formattedBalance, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                          disabled={isCreating}
                          className="text-purple-500 font-medium px-2 py-1 underline-offset-2 hover:underline"
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
          </CardContent>
        </Card>
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            variant="cta-solid"
            disabled={isCreating}
            className="px-8 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Create Bounty
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
