import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseLLM } from "langchain/llms/base";

/**
 * Generate a Gemini client.
 *
 * @param {number} temperature - The temperature to use for the model.
 * @returns {Object} An object with the Gemini client and helper method.
 */
export const geminiModel = (temperature = 0.7) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  class GeminiLLM extends BaseLLM {
    constructor() {
      super({
        cache: undefined,
        verbose: false,
        callbacks: undefined,
        tags: undefined,
        metadata: undefined,
      });
      this.model = model;
      this.temperature = temperature;
    }

    _llmType() {
      return "gemini";
    }

    async _call(prompt) {
      try {
        const response = await this.model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: this.temperature,
            maxOutputTokens: 1024,
          },
        });

        if (!response || !response.response) {
          throw new Error("Invalid response from Gemini API");
        }

        const text = response.response.text();
        if (!text) {
          throw new Error("Empty response from Gemini API");
        }

        return text;
      } catch (error) {
        console.error("Error in Gemini LLM call:", error);
        throw error;
      }
    }

    async _generate(prompts, options, runManager) {
      const generations = [];
      
      for (const prompt of prompts) {
        try {
          const text = await this._call(prompt);
          generations.push([
            {
              text: text,
              generationInfo: {
                finishReason: "stop",
              },
            }
          ]);
        } catch (error) {
          console.error("Error in Gemini LLM generate:", error);
          throw error;
        }
      }

      if (generations.length === 0) {
        throw new Error("No generations were produced");
      }

      return {
        generations: generations,
        llmOutput: {
          tokenUsage: {
            totalTokens: 0,
            promptTokens: 0,
            completionTokens: 0,
          },
        },
      };
    }
  }

  return new GeminiLLM();
};