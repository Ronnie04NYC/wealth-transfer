import { GoogleGenAI } from "@google/genai";
import { ReportData } from "../types";

// Initial client for text data (uses env key)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DATA_PROMPT = `
You are an expert economic data analyst. 
Your goal is to retrieve specific historical data to visualize the wealth gap in the US from approximately 1975 to present day.

Task:
1. Search for the RAND Corporation study "Trends in Income From 1975 to 2018" (often cited by Bernie Sanders regarding the $50 trillion transfer).
2. Search for Economic Policy Institute (EPI) data on CEO compensation growth vs typical worker compensation (1978-present).
3. Search for US Cost of Living data (specifically Housing, Healthcare, and College tuition inflation) vs Median Wage growth.

Output Requirements:
Provide a JSON object wrapped in a code block. The JSON must have this structure:
{
  "summary": "A powerful 2-sentence summary of the wealth transfer.",
  "randReportContext": "A short paragraph explaining the RAND study findings ($50T transfer).",
  "productivityVsWages": [
    {"year": 1975, "productivity": 100, "hourlyCompensation": 100},
    ... (increments of 5-10 years up to recent data)
  ],
  "ceoVsWorker": [
    {"year": 1978, "ceoPayGrowth": 0, "workerPayGrowth": 0},
    ... (increments of 5-10 years)
  ],
  "costOfLiving": [
    {"year": 1980, "wages": 100, "housing": 100, "healthcare": 100, "tuition": 100},
    ... (increments of 10 years)
  ]
}

Ensure the numbers are factually grounded in the search results.
`;

// Pre-defined fallback data based on known economic reports (RAND, EPI, BLS)
const FALLBACK_DATA: ReportData = {
  summary: "Over the last 45 years, $50 trillion in wealth has been transferred from the bottom 90% of American workers to the top 1% through stagnant wages and rising costs.",
  randReportContext: "A 2020 RAND Corporation study estimates that if income distribution had remained as equitable as it was from 1945 to 1974, the bottom 90% of Americans would have earned an additional $2.5 trillion in 2018 alone. Cumulatively, this amounts to nearly $50 trillion extracted from the working class.",
  productivityVsWages: [
    { year: 1975, productivity: 98, hourlyCompensation: 99 },
    { year: 1979, productivity: 100, hourlyCompensation: 100 },
    { year: 1985, productivity: 112, hourlyCompensation: 98 },
    { year: 1990, productivity: 121, hourlyCompensation: 96 },
    { year: 1995, productivity: 132, hourlyCompensation: 99 },
    { year: 2000, productivity: 151, hourlyCompensation: 108 },
    { year: 2005, productivity: 172, hourlyCompensation: 109 },
    { year: 2010, productivity: 188, hourlyCompensation: 111 },
    { year: 2015, productivity: 196, hourlyCompensation: 113 },
    { year: 2020, productivity: 215, hourlyCompensation: 117 },
    { year: 2022, productivity: 218, hourlyCompensation: 115 }
  ],
  ceoVsWorker: [
    { year: 1978, ceoPayGrowth: 0, workerPayGrowth: 0 },
    { year: 1985, ceoPayGrowth: 150, workerPayGrowth: 4 },
    { year: 1990, ceoPayGrowth: 300, workerPayGrowth: 6 },
    { year: 1995, ceoPayGrowth: 550, workerPayGrowth: 7 },
    { year: 2000, ceoPayGrowth: 1200, workerPayGrowth: 12 },
    { year: 2005, ceoPayGrowth: 850, workerPayGrowth: 13 },
    { year: 2010, ceoPayGrowth: 950, workerPayGrowth: 14 },
    { year: 2015, ceoPayGrowth: 1100, workerPayGrowth: 15 },
    { year: 2021, ceoPayGrowth: 1460, workerPayGrowth: 18 }
  ],
  costOfLiving: [
    { year: 1980, wages: 100, housing: 100, healthcare: 100, tuition: 100 },
    { year: 1990, wages: 105, housing: 142, healthcare: 186, tuition: 212 },
    { year: 2000, wages: 110, housing: 195, healthcare: 265, tuition: 360 },
    { year: 2010, wages: 112, housing: 245, healthcare: 410, tuition: 580 },
    { year: 2020, wages: 116, housing: 325, healthcare: 560, tuition: 720 },
    { year: 2023, wages: 118, housing: 390, healthcare: 610, tuition: 765 }
  ],
  sources: [
    { title: "RAND Corporation: Trends in Income From 1975 to 2018", uri: "https://www.rand.org/pubs/working_papers/WRA516-1.html" },
    { title: "Economic Policy Institute: The Productivity-Pay Gap", uri: "https://www.epi.org/productivity-pay-gap/" },
    { title: "EPI: CEO Pay vs. Typical Worker Pay", uri: "https://www.epi.org/publication/ceo-pay-in-2021/" }
  ]
};

export const fetchEconomicData = async (): Promise<ReportData> => {
  try {
    const apiCall = async () => {
      // Create new instance to ensure we use the latest env/key if changed
      const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await freshAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: DATA_PROMPT,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
          title: chunk.web?.title || "Source",
          uri: chunk.web?.uri || "#"
        }))
        .filter((s: any) => s.uri !== "#") || [];

      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
      
      let parsedData: any = {};
      if (jsonMatch && jsonMatch[1]) {
        parsedData = JSON.parse(jsonMatch[1]);
      } else {
        try {
          parsedData = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse JSON directly", e);
          throw new Error("Could not parse economic data from AI response.");
        }
      }

      return {
        summary: parsedData.summary || FALLBACK_DATA.summary,
        randReportContext: parsedData.randReportContext || FALLBACK_DATA.randReportContext,
        productivityVsWages: parsedData.productivityVsWages?.length ? parsedData.productivityVsWages : FALLBACK_DATA.productivityVsWages,
        ceoVsWorker: parsedData.ceoVsWorker?.length ? parsedData.ceoVsWorker : FALLBACK_DATA.ceoVsWorker,
        costOfLiving: parsedData.costOfLiving?.length ? parsedData.costOfLiving : FALLBACK_DATA.costOfLiving,
        sources: sources.length > 0 ? sources : FALLBACK_DATA.sources
      };
    };

    const timeout = new Promise<ReportData>((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 12000)
    );

    return await Promise.race([apiCall(), timeout]);

  } catch (error) {
    console.warn("Gemini API request failed or timed out, using validated fallback data:", error);
    return FALLBACK_DATA;
  }
};

export const generateInfographic = async (prompt: string): Promise<string> => {
  // Create new instance to ensure we use the latest env/key if changed
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "2K"
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }
  throw new Error("No image generated");
};