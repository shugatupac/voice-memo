import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: import.meta.env.VITE_ASSEMBLYAI_API_KEY || "",
});

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!import.meta.env.VITE_ASSEMBLYAI_API_KEY) {
    throw new Error("AssemblyAI API key is not configured");
  }

  try {
    // First, upload the audio file
    const uploadResponse = await client.files.upload(audioBlob);

    // Then create and wait for the transcript
    const transcript = await client.transcripts.create({
      audio_url: uploadResponse.url,
      language_code: "en",
    });

    // Poll for completion
    let result;
    while (true) {
      result = await client.transcripts.get(transcript.id);
      if (result.status === "completed") {
        break;
      } else if (result.status === "error") {
        throw new Error("Transcription failed");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return result.text || "";
  } catch (error) {
    console.error("AssemblyAI transcription error:", error);
    throw error;
  }
}
