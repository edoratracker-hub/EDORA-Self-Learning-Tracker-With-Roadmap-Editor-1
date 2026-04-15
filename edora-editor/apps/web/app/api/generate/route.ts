import { createGroq } from "@ai-sdk/groq";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { streamText } from "ai";
import { match } from "ts-pattern";

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  // Check if the GROQ_API_KEY is set, if not return 400
  if (!process.env.GROQ_API_KEY) {
    return new Response("Missing GROQ_API_KEY - make sure to add it to your .env file.", {
      status: 400,
    });
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  const { prompt, option, command } = await req.json();
  const messages = match(option)
    .with("continue", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
          "Return ONLY the requested text. Do NOT include any conversational filler, greetings, or explanations. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: prompt,
      },
    ])
    .with("improve", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that improves existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
          "Return ONLY the improved text. Do NOT include any conversational filler, greetings, or explanations. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("shorter", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that shortens existing text. " + 
          "Return ONLY the shortened text. Do NOT include any conversational filler, greetings, or explanations. " + 
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("longer", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that lengthens existing text. " +
          "Return ONLY the lengthened text. Do NOT include any conversational filler, greetings, or explanations. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("fix", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
          "Return ONLY the fixed text. Do NOT include any conversational filler, greetings, or explanations. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `The existing text is: ${prompt}`,
      },
    ])
    .with("zap", () => [
      {
        role: "system",
        content:
          "You are an AI writing assistant that generates text based on a prompt. " +
          "You take an input from the user and a command for manipulating the text. " +
          "Return ONLY the generated text. Do NOT include any conversational filler, greetings, or explanations. " +
          "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        content: `For this text: ${prompt}. You have to respect the command: ${command}`,
      },
    ])
    .run();

  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const result = await streamText({
    system: messages[0].content,
    prompt: messages[messages.length - 1].content,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    model: groq("llama-3.1-8b-instant"),
  });

  return result.toDataStreamResponse();
}
