export const FEATURE_FLAGS = {
  LIVE_SENTIMENT: "live_sentiment",
  UPSELL_PROMPTS: "upsell_prompts",
  AI_CHAT_ASSISTANT: "ai_chat_assistant",
  LIVE_MONITORING: "live_monitoring",
  ADVANCED_ANALYTICS: "advanced_analytics",
  POST_CALL_TRANSCRIPTION: "post_call_transcription",
  LIVE_INTENT_DETECTION: "live_intent_detection",
  COMPLIANCE_MONITORING: "compliance_monitoring",
  MANAGER_DASHBOARDS: "manager_dashboards",
} as const;

export type FeatureFlag = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];
