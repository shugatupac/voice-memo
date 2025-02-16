import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function summarizeText(text: string) {
  if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key is not configured");
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Please analyze this text and provide:\n1. A bullet-point summary\n2. Key takeaways\n3. A timeline of main points\n\nText: ${text}`,
        },
      ],
    });

    const result = response.content[0].text;
    const sections = result.split(/\d+\./).filter(Boolean);

    return {
      summary: sections[0]
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.trim().replace(/^[\-\*]\s*/, "")),
      keyPoints: sections[1]
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.trim().replace(/^[\-\*]\s*/, "")),
      timestamps: sections[2]
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const timeMatch = line.match(/([\d:]+)/);
          const time = timeMatch ? timeMatch[1] : "0:00";
          const text = line
            .replace(/^[\-\*]\s*/, "")
            .replace(timeMatch?.[0] || "", "")
            .trim();
          return { time, text };
        }),
    };
  } catch (error) {
    console.error("Summarization error:", error);
    throw error;
  }
}
