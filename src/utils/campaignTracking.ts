export interface CampaignContext {
  source?: string;
  campaign?: string;
  offer?: string;
  description?: string;
  adUrl?: string;
}

export function getCampaignContextFromUrl(): CampaignContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('src') || params.get('utm_source') || undefined;
    const campaign = params.get('camp') || params.get('utm_campaign') || undefined;
    const offer = params.get('offer') || undefined;
    const description = params.get('desc') || undefined;
    const adUrl = params.get('ad_url') || undefined;

    if (!source && !campaign && !offer && !description && !adUrl) {
      const saved = sessionStorage.getItem('clikchat_campaign_context');
      return saved ? JSON.parse(saved) : null;
    }

    const ctx: CampaignContext = { source, campaign, offer, description, adUrl };
    sessionStorage.setItem('clikchat_campaign_context', JSON.stringify(ctx));
    return ctx;
  } catch (e) {
    return null;
  }
}
