import { LLMChain } from "langchain/chains";
import { geminiModel } from "../models/palm.js";
import { coursePrompt } from "../templates/courseTemplate.js";
import { jsonParser, formatResponse } from "../utils/jsonParser.js";

/**
 * Generate a course syllabus using the Gemini model.
 *
 * @param {string} topic - The topic for which to generate a course syllabus.
 * @returns {Promise<Object>} A Promise that resolves to a single course object with title and syllabus.
 * @throws {Error} An error is thrown if the model fails to generate a course syllabus.
 */

export const generateCourse = async (topic) => {
  const model = geminiModel(0.2);
  const chain = new LLMChain({
    llm: model,
    prompt: coursePrompt,
    verbose: true,
  });

  try {
    const result = await chain.call({ topic: topic });
    console.log("Raw LLM result:", result.text);
    
    const parsedResult = jsonParser(result.text);
    console.log("Parsed result:", parsedResult);
    
    // Handle the array response and convert it to the expected single course format
    if (Array.isArray(parsedResult) && parsedResult.length > 0) {
      // If we get an array of courses, flatten them into a single course
      const combinedSyllabus = [];
      let combinedTitle = `${topic.charAt(0).toUpperCase() + topic.slice(1)} Complete Course`;
      
      // Combine all syllabi from different course sections
      parsedResult.forEach(courseSection => {
        if (courseSection.syllabus && Array.isArray(courseSection.syllabus)) {
          combinedSyllabus.push(...courseSection.syllabus);
        }
      });
      
      return {
        title: combinedTitle,
        syllabus: combinedSyllabus
      };
    } else if (parsedResult && typeof parsedResult === 'object' && parsedResult.title && parsedResult.syllabus) {
      // If it's already a single course object, return as is
      return parsedResult;
    } else {
      throw new Error("Invalid course structure returned from LLM");
    }
  } catch (error) {
    console.error("❌ Error inside course generation:", error);
    throw new Error("Course generation failed!");
  }
};