import { ConfigHeader } from '@/components/layout/ConfigHeader';
import { OrgSetupForm } from '@/features/onboarding/components/OrgSetupForm';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <ConfigHeader
        title="Organization Setup"
        description="Configure your organization settings and complete the onboarding process"

      />

      <OrgSetupForm />
    </div>
  );
}
