
export interface DetectionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

export interface PlasticData {
  id: string;
  date: string;
  location: string;
  detections: DetectionResult[];
  imageUrl: string;
}

export interface AnalyticsData {
  totalDetections: number;
  typeBreakdown: Record<string, number>;
  historicalData: {
    date: string;
    count: number;
  }[];
  hotspots: {
    location: string;
    count: number;
  }[];
}
