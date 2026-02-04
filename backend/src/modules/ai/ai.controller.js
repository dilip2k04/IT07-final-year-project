// ai.controller.js
import { askAI } from "./ai.service.js";

export const askAIController = async (req, res) => {
  try {
    const { prompt, type = "GENERAL" } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ 
        message: "Prompt is required and cannot be empty" 
      });
    }

    const response = await askAI({ 
      prompt: prompt.trim(), 
      type 
    });

    res.json({ 
      success: true,
      response,
      type 
    });
  } catch (err) {
    console.error("AI Controller Error:", err.message);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to process AI request" 
    });
  }
};