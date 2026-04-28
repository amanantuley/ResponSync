const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

async function analyzeCrisis(location, type, severity, description) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // or 1.5-flash, but typical is 1.5-flash

    const prompt = `
    You are an AI decision engine for "ResponSync AI", an Intelligent Crisis Response System.
    Analyze the following emergency report and return a JSON response.
    
    Location: ${location}
    Type: ${type}
    Severity (User Reported): ${severity}
    Description: ${description}
    
    Your JSON output must strictly follow this structure:
    {
      "priority_level": "Critical | High | Medium | Low",
      "recommended_action": "A short, actionable instruction for the user reporting the crisis (e.g., 'Evacuate immediately', 'Stay indoors and lock doors')",
      "required_response_units": ["Ambulance", "Police", "Fire", "Hazmat", etc...]
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response text using a regex to handle markdown code blocks
    const match = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (match) {
        return JSON.parse(match[1]);
    }
    return JSON.parse(responseText);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze crisis with AI");
  }
}

module.exports = { analyzeCrisis };
