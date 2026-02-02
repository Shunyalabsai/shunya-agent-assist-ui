export interface AuditLogChange {
  field: string;
  old?: any;
  new?: any;
}

export interface AuditLogMetadata extends Record<string, unknown> {
  changes?: AuditLogChange[];
  documentId?: string;
  title?: string;
  intentId?: string;
  featureId?: string;
  enabled?: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  metadata?: AuditLogMetadata;
}
