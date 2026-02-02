import { OrgSetupFormData } from '../components/OrgSetupForm';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: FormFieldOption[];
}

export interface FormConfig {
  fields: FormFieldConfig[];
}

export const orgSetupFormConfig: FormConfig = {
  fields: [
    {
      id: 'organizationName',
      label: 'Organization Name',
      type: 'text',
      required: true,
      placeholder: 'Acme Corporation',
      defaultValue: '',
    },
    {
      id: 'domain',
      label: 'Domain',
      type: 'text',
      required: true,
      placeholder: 'acme.com',
      defaultValue: '',
    },
    {
      id: 'industry',
      label: 'Industry',
      type: 'select',
      required: true,
      defaultValue: '',
      options: [
        { value: '', label: 'Select an industry' },
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Finance' },
        { value: 'retail', label: 'Retail' },
        { value: 'telecommunications', label: 'Telecommunications' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'timezone',
      label: 'Timezone',
      type: 'select',
      required: true,
      defaultValue: 'UTC',
      options: [
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Denver', label: 'Mountain Time (MT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'Europe/London', label: 'London (GMT)' },
        { value: 'Asia/Kolkata', label: 'India (IST)' },
      ],
    },
    {
      id: 'contactEmail',
      label: 'Contact Email',
      type: 'email',
      required: true,
      placeholder: 'admin@acme.com',
      defaultValue: '',
    },
    {
      id: 'contactPhone',
      label: 'Contact Phone',
      type: 'tel',
      required: false,
      placeholder: '+1 (555) 123-4567',
      defaultValue: '',
    },
  ],
};
