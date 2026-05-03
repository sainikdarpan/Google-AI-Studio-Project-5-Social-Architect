export interface CampaignIdea {
  theme: string;
  hook: string;
  caption: string;
  visualPrompt: string;
  platform?: string;
  scheduledDate?: string;
}

export interface GeneratedCampaign {
  id: string;
  holiday: string;
  brand: string;
  audience: string;
  ideas: CampaignIdea[];
  createdAt: number;
}

export type AppView = 'campaigns' | 'studio' | 'transformer' | 'calendar';
