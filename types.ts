export interface ChartDataPoint {
  year: number;
  [key: string]: number | string;
}

export interface ReportData {
  summary: string;
  randReportContext: string;
  productivityVsWages: ChartDataPoint[];
  ceoVsWorker: ChartDataPoint[];
  costOfLiving: ChartDataPoint[];
  sources: Array<{ title: string; uri: string }>;
}

export interface CalculatorState {
  currentSalary: number;
  calculatedSalary: number | null;
  lostWages: number | null;
}

export enum SectionType {
  INTRO = 'INTRO',
  PRODUCTIVITY = 'PRODUCTIVITY',
  CEO_PAY = 'CEO_PAY',
  COST_LIVING = 'COST_LIVING',
  CALCULATOR = 'CALCULATOR',
}

export interface InfographicPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

// Add global definition for AI Studio on Window
declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}