'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useWallets } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
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
import {
  Loader2,
  Calendar,
  Mail,
  MessageSquare,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageUpload } from '@/hooks/useImageUpload';

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
  tokenImageUrl: z.string().optional(),
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
    .nonnegative({
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

// Define the steps for the wizard
const STEPS = [
  { id: 'bounty', title: 'Create New Bounty', icon: CheckCircle2 },
  { id: 'timeline', title: 'Timeline', icon: Calendar },
  { id: 'funding', title: 'Funding', icon: MessageSquare },
  { id: 'contact', title: 'Contact', icon: Mail },
];

export const BountyForm = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Replace this with your desired wallet
  const [tokenImageUrl, setTokenImageUrl] = useState<string | null>(null);
  const {
    previewUrl,
    fileInputRef,
    selectedFile,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload();

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
      tokenImageUrl: undefined,
      email: undefined,
      discord: undefined,
      telegram: undefined,
      endOfFunding: undefined,
      endOfSubmissions: undefined,
      endOfVoting: undefined,
      maxAmount: undefined,
      devFees: 0,
      contribution: 0.001,
    },
  });

  // Add a hidden form field for the token image URL
  useEffect(() => {
    if (previewUrl) {
      form.setValue('tokenImageUrl', previewUrl);
    } else {
      form.setValue('tokenImageUrl', undefined);
    }
  }, [previewUrl, form]);

  // Function to go to the next step
  const nextStep = async () => {
    // Validate the current step's fields before proceeding
    let canProceed = true;

    if (currentStep === 0) {
      // Validate bounty details
      const result = await form.trigger(['title', 'symbol', 'description']);
      canProceed = result;
    } else if (currentStep === 1) {
      // Validate timeline
      const result = await form.trigger([
        'endOfFunding',
        'endOfSubmissions',
        'endOfVoting',
      ]);
      canProceed = result;

      // Additional validation for timeline sequence
      const values = form.getValues();
      if (
        values.endOfFunding &&
        values.endOfSubmissions &&
        values.endOfVoting
      ) {
        if (
          values.endOfFunding >= values.endOfSubmissions ||
          values.endOfSubmissions >= values.endOfVoting
        ) {
          form.setError('endOfSubmissions', {
            type: 'manual',
            message: 'Invalid dates sequence. Please check your timeline.',
          });
          canProceed = false;
        }
      }
    } else if (currentStep === 2) {
      // Validate funding
      const result = await form.trigger(['devFees', 'contribution']);
      canProceed = result;
    }

    if (canProceed && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to go to the previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Function to upload image to Supabase
  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      console.log('Preparing to upload image to Supabase', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      const formData = new FormData();
      formData.append('file', file);
      console.log('FormData created with file');

      console.log('Sending request to /api/uploadImage');
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      console.log('Response received', {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed with response:', errorText);
        throw new Error(`Failed to upload image: ${errorText}`);
      }

      const data = await response.json();
      console.log('Upload successful, received URL:', data.url);
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      ErrorToast({
        error:
          error instanceof Error ? error.message : 'Failed to upload image',
      });
      return null;
    }
  };

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
      // Upload image if available
      let imageUrl = values.tokenImageUrl;

      console.log('Selected file in form submission:', selectedFile);

      // Use selectedFile from the hook instead of accessing through fileInputRef
      if (selectedFile) {
        console.log('Uploading image to Supabase');
        const uploadedUrl = await uploadImageToSupabase(selectedFile);
        console.log('Uploaded image URL:', uploadedUrl);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          console.log('Setting image URL to:', imageUrl);
        } else {
          console.error('Failed to get URL from upload');
        }
      } else {
        console.log('No file selected for upload');
      }

      console.log('Creating bounty with image URL:', imageUrl);

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
          token_image_url: imageUrl,
        },
        {
          onSuccess: () => {
            SuccessToast({
              message: 'Your bounty has been created successfully!',
            });
            setTimeout(() => {
              router.push('/bounties');
            }, 5000);
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

  // Animation variants for the cards
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // Progress indicator
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep
                  ? 'bg-purple-500 border-purple-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              } transition-all duration-300`}
            >
              <step.icon className="h-5 w-5" />
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-16 h-1 ${
                  index < currentStep ? 'bg-purple-500' : 'bg-gray-300'
                } transition-all duration-300`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        {renderStepIndicator()}

        <div
          className="relative w-full px-4 sm:px-0"
          style={{ minHeight: '500px' }}
        >
          <AnimatePresence initial={false} custom={currentStep}>
            {currentStep === 0 && (
              <motion.div
                key="bounty"
                custom={currentStep}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-x-0"
              >
                <Card className="border-2 shadow-md overflow-hidden mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold">
                      Create New Bounty
                    </CardTitle>
                    <CardDescription>
                      Create a new bounty to fund AI model development
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                      name="tokenImageUrl"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="block mb-2">
                            Token Image
                          </FormLabel>
                          <div className="flex items-center gap-4">
                            <div
                              onClick={handleThumbnailClick}
                              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
                            >
                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt="Token preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-gray-500 text-center">
                                  + Add Image
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                  handleFileChange(e);
                                  field.onChange(previewUrl);
                                }}
                                accept="image/*"
                                className="hidden"
                              />
                              <FormDescription>
                                Upload an image for your token (optional).
                                Recommended size: 512x512px.
                              </FormDescription>
                              {previewUrl && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    handleRemove();
                                    field.onChange(undefined);
                                  }}
                                  className="mt-2 w-fit"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                            The more information you provide, the higher chance
                            of a successful bounty.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                            <SelectItem value="image">
                              Stable Difusion
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Which model do you want to use as a base?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="timeline"
                custom={currentStep}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-x-0"
              >
                <Card className="border-2 shadow-md overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Timeline
                    </CardTitle>
                    <CardDescription>
                      Set the timeline for your bounty's funding, submissions,
                      and voting periods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="px-6 py-2 font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="funding"
                custom={currentStep}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-x-0"
              >
                <Card className="border-2 shadow-md overflow-hidden">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                            <Input
                              type="number"
                              {...field}
                              disabled={isCreating}
                            />
                          </FormControl>
                          <FormDescription>
                            <div className="flex w-full flex-col sm:flex-row justify-between sm:items-center">
                              <span>
                                Amount of MON you will contribute to the bounty.
                              </span>
                              <div className="flex items-center gap-x-2 mt-2 sm:mt-0">
                                {formattedBalance} MON
                                <Button
                                  size="sm"
                                  type="button"
                                  variant="ghost"
                                  onClick={() => {
                                    form.setValue(
                                      'contribution',
                                      formattedBalance,
                                      {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                        shouldTouch: true,
                                      }
                                    );
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
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="px-6 py-2 font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="contact"
                custom={currentStep}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-x-0"
              >
                <Card className="border-2 shadow-md overflow-hidden">
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="px-6 py-2 font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="cta-solid"
                      disabled={isCreating}
                      className="relative px-8 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl"
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
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Form>
  );
};
