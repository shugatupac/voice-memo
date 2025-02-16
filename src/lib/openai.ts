import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert webm to mp3 if needed (Whisper works better with mp3)
    const audioFile = new File([audioBlob], "audio.webm", {
      type: audioBlob.type,
    });

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "text",
      temperature: 0.2,
      language: "en",
    });

    if (!response.text) {
      throw new Error("No transcription received");
    }

    return response.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}

export async function summarizeText(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes text and extracts key points.",
        },
        {
          role: "user",
          content: `Please analyze this text and provide: \n1. A bullet-point summary\n2. Key takeaways\n3. A timeline of main points\n\nText: ${text}`,
        },
      ],
    });

    const result = response.choices[0].message.content;
    const sections = result.split("\n\n");

    return {
      summary: sections[0]
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.trim().substring(2)),
      keyPoints: sections[1]
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.trim().substring(2)),
      timestamps: sections[2]
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => {
          const [time, ...text] = line.trim().substring(2).split(":");
          return { time: time.trim(), text: text.join(":").trim() };
        }),
    };
  } catch (error) {
    console.error("Summarization error:", error);
    throw error;
  }
}
