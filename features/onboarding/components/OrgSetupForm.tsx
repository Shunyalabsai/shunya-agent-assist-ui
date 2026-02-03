"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Check,
  Loader2,
  Save,
  Upload,
  FileText,
  Building2,
  Settings,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  ProcessingStatusIndicator,
  ProcessingStatus,
} from "@/components/layout/ProcessingStatusIndicator";
import { mockAvailableWidgets } from "@/features/dashboards/data/mock-widgets";

// Mock options
const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "other", label: "Other" },
];

const REGION_OPTIONS = [
  { value: "na", label: "North America" },
  { value: "eu", label: "Europe" },
  { value: "apac", label: "Asia Pacific" },
  { value: "latam", label: "Latin America" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
];

const ROLE_OPTIONS = [
  { value: "manager", label: "Manager" },
  { value: "agent", label: "Agent" },
];

const TELEPHONY_PROVIDERS = [
  { value: "twilio", label: "Twilio" },
  { value: "exotel", label: "Exotel" },
  { value: "ameyo", label: "Ameyo" },
  { value: "genesys", label: "Genesys" },
];

const DOCUMENT_CATEGORIES = [
  { value: "SOP", label: "Standard Operating Procedure (SOP)" },
  { value: "Knowledge Base", label: "Knowledge Base" },
  { value: "Governance", label: "Governance & Compliance" },
];

const STEPS = [
  {
    id: 0,
    title: "Organization",
    description: "Company details",
    icon: Building2,
    fields: [
      "companyName",
      "industry",
      "regions",
      "languages",
      "organizationId",
    ],
  },
  {
    id: 1,
    title: "Configuration",
    description: "Feature setup",
    icon: Settings,
    fields: ["features"],
  },
  {
    id: 2,
    title: "Team",
    description: "Invite members",
    icon: Users,
    fields: ["inviteEmail", "inviteRole"],
  },
  {
    id: 3,
    title: "Integrations",
    description: "Connect services",
    icon: FileText,
    fields: ["telephonyProvider", "apiKey", "documentCategory", "documents"],
  },
];

// Schema
const formSchema = z.object({
  // Step 1
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  regions: z.array(z.string()).min(1, "Select at least one region"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  organizationId: z.string(),

  // Step 2
  features: z.array(z.string()).optional(),

  // Step 3
  inviteEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  inviteRole: z.string().optional(),

  // Step 4
  telephonyProvider: z.string().optional(),
  apiKey: z.string().optional(),
  documentCategory: z.string().optional(),
  documents: z.any().optional(), // File implementation varies, using any for mock
});

export type OrgSetupFormData = z.infer<typeof formSchema>;
type FormData = OrgSetupFormData;

export interface OrgSetupFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
}

export function OrgSetupForm({ onSubmit, initialData }: OrgSetupFormProps) {
  const [status, setStatus] = useState<ProcessingStatus>("pending");
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [defaultOrgId] = useState(
    () =>
      "ORG-" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0"),
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      regions: [],
      languages: [],
      organizationId: defaultOrgId,
      features: mockAvailableWidgets.map((w) => w.id),
      inviteEmail: "",
      inviteRole: "agent",
      telephonyProvider: "",
      apiKey: "",
      documentCategory: "",
      ...initialData,
    },
    mode: "onChange",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue("documents", file);
    }
  };

  const currentStepInfo = STEPS[activeStep];

  const handleNext = async () => {
    // Validate fields for the current step before moving
    // Validate fields for the current step before moving
    const fields = currentStepInfo.fields as any;
    const isValid = await form.trigger(fields);

    if (isValid) {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = async (stepIndex: number) => {
    // Only allow clicking previous steps or the immediate next step if valid
    if (stepIndex < activeStep) {
      setActiveStep(stepIndex);
    } else if (stepIndex === activeStep + 1) {
      // @ts-ignore
      const fields = STEPS[activeStep].fields as any;
      const isValid = await form.trigger(fields);
      if (isValid) setActiveStep(stepIndex);
    }
  };

  const onFinalSubmit = async (values: FormData) => {
    setStatus("processing");
    setMessage("Finalizing setup...");
    setProgress(50);

    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Mock submission
        console.log("Form Submitted:", values);
        if (fileName) {
          console.log("File uploaded:", fileName);
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setProgress(100);
      setStatus("completed");
      setMessage("Setup complete!");
    } catch (error) {
      console.error(error);
      setStatus("failed");
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between w-full relative">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2"></div>

          {/* Active Progress Bar */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-300 ease-in-out"
            style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
          ></div>

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center group cursor-pointer relative z-10"
                onClick={() => handleStepClick(index)}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background
                    ${
                      isActive
                        ? "border-primary text-primary ring-4 ring-primary/20 scale-110"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-gray-300 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-2 text-center hidden md:block absolute -bottom-10 w-32">
                  <p
                    className={`text-sm font-medium ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden lg:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Mobile Step Label */}
        <div className="mt-6 md:hidden text-center">
          <h3 className="font-semibold text-lg">{STEPS[activeStep].title}</h3>
          <p className="text-sm text-muted-foreground">
            {STEPS[activeStep].description}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFinalSubmit)}
          className="space-y-8 pt-6"
        >
          {/* Step 1: Organization Details */}
          {activeStep === 0 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>
                    Enter your organization setup information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            readOnly
                            className="bg-muted text-muted-foreground"
                          />
                        </FormControl>
                        <FormDescription>
                          System generated unique ID.
                        </FormDescription>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INDUSTRY_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
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
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Feature Configuration */}
          {activeStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Configuration</CardTitle>
                  <CardDescription>
                    Configure organization-level features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormDescription>
                    Enable features for your organization. These can be changed
                    later.
                  </FormDescription>
                  <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mockAvailableWidgets.map((widget) => (
                            <FormField
                              key={widget.id}
                              control={form.control}
                              name="features"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={widget.id}
                                    className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0"
                                  >
                                    <div className="space-y-0.5 mr-4">
                                      <FormLabel className="text-base">
                                        {widget.name}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        {widget.description}
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value?.includes(
                                          widget.id,
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                widget.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== widget.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Invite Team Members */}
          {activeStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Invite Team Members</CardTitle>
                  <CardDescription>
                    Invite your first user (Optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inviteEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="user@example.com"
                              type="email"
                            />
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ROLE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Integrations & Documents */}
          {activeStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations & Documents</CardTitle>
                  <CardDescription>
                    Telephony setup and document uploads (Optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Telephony Configuration</CardTitle>
                      <CardDescription>
                        Telephony setup and document uploads (Optional)
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="telephonyProvider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provider</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TELEPHONY_PROVIDERS.map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value}
                                    >
                                      {opt.label}
                                    </SelectItem>
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
                                <Input
                                  {...field}
                                  type="password"
                                  placeholder="sk_test_..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Document Uploads</CardTitle>
                      <CardDescription>
                        Upload any relevant compliance or registration
                        documents.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="documentCategory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Document Type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {DOCUMENT_CATEGORIES.map((opt) => (
                                      <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                      >
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormItem>
                          <FormLabel>Upload Document</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                  {fileName ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                                      {fileName}
                                    </p>
                                  ) : (
                                    <>
                                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PDF, DOCX (MAX. 5MB)
                                      </p>
                                    </>
                                  )}
                                </div>
                                <Input
                                  id="dropzone-file"
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload any relevant compliance or registration
                            documents.
                          </FormDescription>
                        </FormItem>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur-sm z-50 md:relative md:border-t-0 md:bg-transparent md:p-0">
            <div className="max-w-4xl mx-auto flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={activeStep === 0 || status === "processing"}
                className={activeStep === 0 ? "invisible" : ""}
              >
                <ChevronLeft className="mr-2 size-4" />
                Previous
              </Button>

              {activeStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={status === "processing"}>
                  {status === "processing" ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}
                  Finalize Setup
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
