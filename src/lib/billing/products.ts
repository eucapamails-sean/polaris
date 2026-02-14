export const STRIPE_PRODUCTS = {
  org: {
    starter: {
      name: 'Polaris Starter',
      description: 'Essential legislative tracking for small organizations',
      monthlyPrice: 0,
      annualPrice: 0,
      features: {
        savedSearches: 5,
        monitoringTopics: 5,
        jurisdictions: 1,
        aiSummaries: 'basic',
        semanticSearch: false,
        crmContacts: 0,
        apiAccess: 'none',
      },
    },
    professional: {
      name: 'Polaris Professional',
      description: 'Advanced intelligence for growing teams',
      monthlyPrice: 29900, // $299/mo in cents
      annualPrice: 287040, // $2870.40/yr ($239.20/mo)
      features: {
        savedSearches: 25,
        monitoringTopics: 25,
        jurisdictions: 'national+states',
        aiSummaries: 'full',
        semanticSearch: true,
        crmContacts: 100,
        apiAccess: 'read',
      },
    },
    enterprise: {
      name: 'Polaris Enterprise',
      description: 'Full platform for large organizations',
      monthlyPrice: 99900, // $999/mo
      annualPrice: 959040, // $9590.40/yr
      features: {
        savedSearches: Infinity,
        monitoringTopics: 100,
        jurisdictions: 'multi-country',
        aiSummaries: 'full+impact',
        semanticSearch: true,
        crmContacts: Infinity,
        apiAccess: 'read_write',
      },
    },
    global: {
      name: 'Polaris Global',
      description: 'Unlimited access for global operations',
      monthlyPrice: 249900, // $2499/mo
      annualPrice: 2399040, // $23990.40/yr
      features: {
        savedSearches: Infinity,
        monitoringTopics: Infinity,
        jurisdictions: 'all',
        aiSummaries: 'full+impact+custom',
        semanticSearch: true,
        crmContacts: Infinity,
        apiAccess: 'full',
      },
    },
  },
  pol: {
    foundation: {
      name: 'Polaris Foundation',
      description: 'Free tier for elected officials',
      monthlyPrice: 0,
      annualPrice: 0,
    },
    professional: {
      name: 'Polaris Professional (Politician)',
      description: 'Competitive intelligence tools',
      monthlyPrice: 9900,
      annualPrice: 95040,
    },
    strategic: {
      name: 'Polaris Strategic',
      description: 'Full strategic positioning suite',
      monthlyPrice: 24900,
      annualPrice: 239040,
    },
    campaign: {
      name: 'Polaris Campaign',
      description: 'Complete campaign intelligence',
      monthlyPrice: 49900,
      annualPrice: 479040,
    },
  },
} as const;

export type OrgProduct = keyof typeof STRIPE_PRODUCTS.org;
export type PolProduct = keyof typeof STRIPE_PRODUCTS.pol;
