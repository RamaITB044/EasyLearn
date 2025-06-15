import Groq from "groq-sdk";

/**
 * Generate a Groq client.
 *
 * @param {number} temperature - The temperature to use for the model.
 * @returns {Object} An object with the Groq client and helper method.
 */

export const groqModel = (temperature = 0.7) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  /**
   * Generate a chat completion
   * @param {string|Array} messages - The messages to send
   * @returns {Promise} The completion response
   */
  const chat = async (messages) => {
    // Handle string input
    if (typeof messages === "string") {
      messages = [{ role: "user", content: messages }];
    }

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-70b-versatile", // Free tier model
      temperature: temperature,
      max_tokens: 1024,
      stream: false,
    });

    return completion.choices[0]?.message?.content;
  };

  return {
    client: groq,
    chat,
  };
};
