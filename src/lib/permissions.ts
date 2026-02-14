export type UserSide = 'org' | 'politician' | 'dual';
export type OrgTier = 'starter' | 'professional' | 'enterprise' | 'global';
export type PolTier = 'foundation' | 'professional' | 'strategic' | 'campaign';
export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface UserContext {
  userId: string;
  side: UserSide;
  orgId?: string;
  orgRole?: OrgRole;
  orgTier?: OrgTier;
  polTier?: PolTier;
  politicianId?: string;
  jurisdictions: string[];
}

export const FEATURE_ACCESS: Record<string, { orgTiers?: OrgTier[]; polTiers?: PolTier[] }> = {
  // Legislative tracking
  'legislative.search': { orgTiers: ['starter', 'professional', 'enterprise', 'global'] },
  'legislative.ai_summaries': { orgTiers: ['professional', 'enterprise', 'global'] },
  'legislative.ai_impact': { orgTiers: ['enterprise', 'global'] },
  'legislative.semantic_search': { orgTiers: ['professional', 'enterprise', 'global'] },

  // Monitoring
  'monitoring.basic': { orgTiers: ['starter', 'professional', 'enterprise', 'global'] },
  'monitoring.unlimited': { orgTiers: ['enterprise', 'global'] },
  'monitoring.custom_query': { orgTiers: ['enterprise', 'global'] },

  // Alerts
  'alerts.realtime': { orgTiers: ['professional', 'enterprise', 'global'] },
  'alerts.daily': { orgTiers: ['starter', 'professional', 'enterprise', 'global'] },

  // CRM
  'crm.contacts': { orgTiers: ['professional', 'enterprise', 'global'] },
  'crm.unlimited_contacts': { orgTiers: ['enterprise', 'global'] },

  // API access
  'api.read': { orgTiers: ['professional', 'enterprise', 'global'] },
  'api.write': { orgTiers: ['enterprise', 'global'] },
  'api.full': { orgTiers: ['global'] },

  // Politician features
  'pol.competitive_intel': { polTiers: ['professional', 'strategic', 'campaign'] },
  'pol.constituency_data': { polTiers: ['professional', 'strategic', 'campaign'] },
  'pol.campaign_suite': { polTiers: ['campaign'] },
  'pol.promoted_visibility': { polTiers: ['strategic', 'campaign'] },
};

export const TIER_LIMITS: Record<OrgTier, { savedSearches: number; monitoringTopics: number; crmContacts: number }> = {
  starter: { savedSearches: 5, monitoringTopics: 5, crmContacts: 0 },
  professional: { savedSearches: 25, monitoringTopics: 25, crmContacts: 100 },
  enterprise: { savedSearches: Infinity, monitoringTopics: 100, crmContacts: Infinity },
  global: { savedSearches: Infinity, monitoringTopics: Infinity, crmContacts: Infinity },
};

export function hasAccess(ctx: UserContext, feature: string): boolean {
  const access = FEATURE_ACCESS[feature];
  if (!access) return false;

  if (ctx.side === 'org' || ctx.side === 'dual') {
    if (access.orgTiers && ctx.orgTier && access.orgTiers.includes(ctx.orgTier)) {
      return true;
    }
  }

  if (ctx.side === 'politician' || ctx.side === 'dual') {
    if (access.polTiers && ctx.polTier && access.polTiers.includes(ctx.polTier)) {
      return true;
    }
  }

  return false;
}
