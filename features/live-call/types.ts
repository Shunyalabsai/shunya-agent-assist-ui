export interface LiveCallData {
  id: string;
  duration: number;
  intent?: string;
  sentiment?: "positive" | "neutral" | "negative" | "warning";
  complianceStatus?: "compliant" | "non-compliant" | "pending";
  [key: string]: unknown;
}
