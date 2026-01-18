
import { GoogleGenAI, Type } from "@google/genai";
import { AladdinAnalysis, LifePhase } from "./types";

const SYSTEM_INSTRUCTION = `你是一位名為 "Human Aladdin" 的風險護欄系統。
你的目的不是預測未來，也不是擔任財務顧問，更不是為用戶做決定。
你的首要目標是風險控制、生存，以及長期持續性。

核心規則：
1. 絕對不預測成功或保證結果。禁止使用「一定會」、「將會」、「最終導致」、「必然造成」等預測性詞彙。
2. 絕不使用命令式語言。禁止說「你應該」、「你必須」、「現在不做就...」，改用「在此狀態下較不適合」、「可能提高風險成本」、「增加結構成本」等詞。
3. 識別當前狀態 (CURRENT STATE) 與禁止行為 (Guardrails/風險護欄)。
4. 提供「安全行動半徑」，強調其特性：可以暫停、可以縮小、可以快速撤回、不改變核心結構。
5. 所有輸出必須使用繁體中文。

領域特定分析：
- 商業 (Business)：分析結構性風險、現金續航與營運脆弱點。
- 投資 (Investment)：檢查倉位比例、時間壓力與一次性出局風險。
- 生活 (Life)：評估決策者的精力狀態、心理壓力與行為的可回收性。

輸出框架定稿要求：
- 狀態判斷 (phaseReasoning)：必須包含或轉述：「目前的系統狀態顯示，你的結構仍具備運作能力，但對於單一變因的承受度正在下降。在這種狀態下，任何額外的壓力、延遲或不可回收的變動，都可能顯著提高修復成本。這不是結果判斷，而是對『目前可承受範圍』的描述。」
- 常見錯誤提醒 (dangerousBehaviors)：說明這些行為通常是為了對抗不安或壓力，而非理性評估。
- 風險護欄 (guardrails)：必須明確標註為目前狀態下的禁止行為。
- 免責聲明：固定為：「提醒：Human Aladdin 僅提供風險與狀態提示，不構成預測、建議或指令。所有決定與其後果，仍由使用者自行判斷與承擔。」`;

export const analyzeSituation = async (category: string, data: any): Promise<AladdinAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `類別：${category}\n內容快照：${JSON.stringify(data)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          phase: {
            type: Type.STRING,
            enum: Object.values(LifePhase)
          },
          phaseReasoning: { type: Type.STRING },
          resilience: { type: Type.STRING, description: "系統承受度描述 (例如: 偏低, 中等)" },
          humanState: { type: Type.STRING, description: "決策者的狀態描述 (例如: 緊繃, 過載)" },
          riskSignals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                signal: { type: Type.STRING },
                description: { type: Type.STRING },
                riskLevel: { type: Type.STRING, enum: ["高", "中", "低"] }
              },
              required: ["signal", "description", "riskLevel"]
            }
          },
          dangerousBehaviors: { type: Type.ARRAY, items: { type: Type.STRING } },
          guardrails: { type: Type.ARRAY, items: { type: Type.STRING } },
          safeActionRadius: { type: Type.ARRAY, items: { type: Type.STRING } },
          survivalMetric: { type: Type.STRING },
          disclaimer: { type: Type.STRING }
        },
        required: ["phase", "phaseReasoning", "resilience", "humanState", "dangerousBehaviors", "guardrails", "safeActionRadius", "survivalMetric", "disclaimer"]
      }
    }
  });

  try {
    return JSON.parse(response.text) as AladdinAnalysis;
  } catch (error) {
    console.error("Failed to parse response", error);
    throw new Error("分析失敗，請檢查輸入內容。");
  }
};
