
export interface WeedClassification {
  class: string;
  is_weed: boolean;
  confidence: number;
  description: string;
  severity_level: 'Low' | 'Medium' | 'High' | 'None' | string;
  recommended_actions: string;
}
