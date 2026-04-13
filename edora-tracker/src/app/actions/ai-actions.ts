"use server";

export async function getEdoraAiResponse(history: { role: "user" | "assistant"; content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: "Missing GEMINI_API_KEY in environment variables." };
  }

  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are Edora AI, a highly intelligent, encouraging, and helpful career, mentoring, and technical assistant. Provide clear, well-formatted, and actionable advice to users." }]
        },
        contents: formattedHistory,
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return { 
      success: true, 
      text: data.candidates[0].content.parts[0].text 
    };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { success: false, error: error.message };
  }
}

export async function generateResumeContent(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Missing GEMINI_API_KEY" };
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are an expert ATS-friendly resume writer. The user will give you keywords or short phrases. Your job is to generate a professional, polished paragraph or bullet points that would look excellent on a resume. Do not use conversational filler like 'Here is the paragraph'. Just strictly output the text for the resume." }]
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return { success: true, text: data.candidates[0].content.parts[0].text.trim() };
  } catch (error: any) {
    console.error("Resume AI Gen Error:", error);
    return { success: false, error: error.message };
  }
}
