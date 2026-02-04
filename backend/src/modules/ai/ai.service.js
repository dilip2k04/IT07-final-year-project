// ai.service.js - Improved with better prompt formatting
const OLLAMA_URL = "http://localhost:11434/api/generate";

export const askAI = async ({ prompt, type }) => {
  const systemPrompts = {
    CODE: `You are a senior software engineer. Follow these rules:
1. Provide clean, production-ready code
2. Include comments for complex logic
3. Mention best practices when relevant
4. Format code with proper syntax highlighting
5. Explain your approach briefly

User question:`,
    SUMMARY: `You are a summarization expert. Follow these rules:
1. Extract key points concisely
2. Maintain original meaning
3. Use bullet points for clarity
4. Keep it objective and factual

Text to summarize:`,
    TRANSLATE: `You are a professional translator. Follow these rules:
1. Translate accurately preserving meaning
2. Maintain appropriate tone
3. Handle idioms and cultural references properly
4. Note any ambiguities

Text to translate:`,
    GENERAL: `You are a helpful, knowledgeable AI assistant. 
Provide clear, accurate, and concise responses.

User question:`
  };

  const systemPrompt = systemPrompts[type] || systemPrompts.GENERAL;
  const fullPrompt = `${systemPrompt}\n\n${prompt}`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama API Error:", response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || "No response generated. Please try again.";
  } catch (error) {
    console.error("Error in askAI:", error.message);
    
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      throw new Error('Cannot connect to AI service. Please check if Ollama is running.');
    }
    
    throw new Error(`AI service error: ${error.message}`);
  }
};