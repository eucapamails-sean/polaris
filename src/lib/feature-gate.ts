import { getUserContext } from './auth';
import { hasAccess } from './permissions';
import { apiError } from './api';

export async function requireFeature(feature: string) {
  const ctx = await getUserContext();
  if (!ctx) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }
  if (!hasAccess(ctx, feature)) {
    return apiError('TIER_LIMIT_EXCEEDED', `Feature '${feature}' requires a higher tier`, 403);
  }
  return null;
}
