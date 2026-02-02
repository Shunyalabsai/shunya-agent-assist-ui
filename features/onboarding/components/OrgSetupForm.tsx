'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, Loader2, ArrowRight, Save, Upload, Phone, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MultiSelect } from '@/components/ui/multi-select';
import { ProcessingStatusIndicator, ProcessingStatus } from '@/components/layout/ProcessingStatusIndicator';
import { mockAvailableWidgets } from '@/features/dashboards/data/mock-widgets';

// Mock options
const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'other', label: 'Other' },
];

const REGION_OPTIONS = [
  { value: 'na', label: 'North America' },
  { value: 'eu', label: 'Europe' },
  { value: 'apac', label: 'Asia Pacific' },
  { value: 'latam', label: 'Latin America' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
];

const ROLE_OPTIONS = [
  { value: 'manager', label: 'Manager' },
  { value: 'agent', label: 'Agent' },
];

const TELEPHONY_PROVIDERS = [
  { value: 'twilio', label: 'Twilio' },
  { value: 'exotel', label: 'Exotel' },
  { value: 'ameyo', label: 'Ameyo' },
  { value: 'genesys', label: 'Genesys' },
];

// Schema
const formSchema = z.object({
  // Step 1
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  regions: z.array(z.string()).min(1, 'Select at least one region'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  organizationId: z.string(),

  // Step 2
  features: z.array(z.string()).optional(),

  // Step 3
  inviteEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  inviteRole: z.string().optional(),

  // Step 4
  telephonyProvider: z.string().optional(),
  apiKey: z.string().optional(),
  documents: z.any().optional(), // File implementation varies, using any for mock
});

export type OrgSetupFormData = z.infer<typeof formSchema>;
type FormData = OrgSetupFormData;

export interface OrgSetupFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
}

export function OrgSetupForm({ onSubmit, initialData }: OrgSetupFormProps) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<ProcessingStatus>('pending');
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      regions: [],
      languages: [],
      organizationId: 'ORG-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      features: mockAvailableWidgets.map(w => w.id),
      inviteEmail: '',
      inviteRole: 'agent',
      telephonyProvider: '',
      apiKey: '',
      ...initialData,
    },
    mode: 'onChange',
  });

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(['companyName', 'industry', 'regions', 'languages']);
    } else if (step === 2) {
      isValid = true;
    } else if (step === 3) {
      // Validate step 3 if filled, otherwise proceed (it's optional in schema but we check formatting)
      const email = form.getValues('inviteEmail');
      if (email) {
        isValid = await form.trigger(['inviteEmail', 'inviteRole']);
      } else {
        isValid = true;
      }
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('documents', file);
    }
  };

  const onFinalSubmit = async (values: FormData) => {
    setStatus('processing');
    setMessage('Finalizing setup...');
    setProgress(50);

    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Mock submission
        console.log('Form Submitted:', values);
        if (fileName) {
          console.log('File uploaded:', fileName);
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setProgress(100);
      setStatus('completed');
      setMessage('Setup complete!');
    } catch (error) {
      console.error(error);
      setStatus('failed');
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <ProcessingStatusIndicator
        status={status}
        message={message}
        progress={progress}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Organization Details'}
            {step === 2 && 'Feature Configuration'}
            {step === 3 && 'Invite Team Members'}
            {step === 4 && 'Integrations & Documents'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Step 1 of 4: Enter your organization setup information'}
            {step === 2 && 'Step 2 of 4: Configure organization-level features'}
            {step === 3 && 'Step 3 of 4: Invite your first user'}
            {step === 4 && 'Step 4 of 4: Telephony setup and document uploads (Optional)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {/* Step 1: Org Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization ID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled readOnly className="bg-muted text-muted-foreground" />
                        </FormControl>
                        <FormDescription>System generated unique ID.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Acme Inc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INDUSTRY_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regions</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={REGION_OPTIONS}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Select regions..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={LANGUAGE_OPTIONS}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Select languages..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Features */}
              {step === 2 && (
                <div className="space-y-4">
                  <FormDescription>
                    Enable features for your organization. These can be changed later.
                  </FormDescription>
                  <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 gap-4">
                          {mockAvailableWidgets.map((widget) => (
                            <FormField
                              key={widget.id}
                              control={form.control}
                              name="features"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={widget.id}
                                    className="flex flex-row items-center justify-between rounded-lg border p-4"
                                  >
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        {widget.name}
                                      </FormLabel>
                                      <FormDescription>
                                        {widget.description}
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value?.includes(widget.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), widget.id])
                                            : field.onChange(
                                              field.value?.filter((value) => value !== widget.id)
                                            )
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Invite */}
              {step === 3 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="inviteEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="user@example.com" type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inviteRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROLE_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 4: Telephony & Documents */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Phone className="size-5 text-muted-foreground" />
                      <h3 className="font-medium">Telephony Configuration</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="telephonyProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provider</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TELEPHONY_PROVIDERS.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="sk_test_..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <FileText className="size-5 text-muted-foreground" />
                      <h3 className="font-medium">Document Uploads</h3>
                    </div>
                    <FormItem>
                      <FormLabel>Upload Organization Documents</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                              {fileName ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{fileName}</p>
                              ) : (
                                <>
                                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX (MAX. 5MB)</p>
                                </>
                              )}
                            </div>
                            <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>Upload any relevant compliance or registration documents.</FormDescription>
                    </FormItem>
                  </div>
                </div>
              )}

            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="ghost" type="button" onClick={() => setStep(step - 1)}>Back</Button>
            )}
          </div>
          <div className="flex gap-2">
            {(step === 2 || step === 3 || step === 4) && (
              <Button variant="outline" type="button" onClick={step === 4 ? () => form.handleSubmit(onFinalSubmit)() : handleSkip}>Skip</Button>
            )}

            {step < 4 ? (
              <Button type="button" onClick={handleNext}>
                {step === 3 ? 'Next' : 'Save & Continue'} <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={form.handleSubmit(onFinalSubmit)} disabled={status === 'processing'}>
                {status === 'processing' ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                Finish
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
