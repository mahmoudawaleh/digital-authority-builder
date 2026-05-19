import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

type Body = {
  tool: string;
  inputs: Record<string, string>;
};

const PROMPTS: Record<string, (i: Record<string, string>) => { system: string; user: string }> = {
  bio: (i) => ({
    system:
      "You are an expert brand copywriter who writes concise, authoritative business bios for the M2 Digital Authority Engine. Output 2 paragraphs, ~120 words, confident tone, no emojis, no markdown headings.",
    user: `Write a business bio.\nName: ${i.name}\nIndustry: ${i.industry}\nCity: ${i.city}\nKey facts: ${i.facts}`,
  }),
  blog: (i) => ({
    system:
      "You are an SEO content writer. Output a complete blog post in markdown with a single # title, a short intro, 3 H2 sections, and a closing call-to-action. ~400 words.",
    user: `Write a blog post for ${i.name} (${i.industry}, ${i.city}). Angle: ${i.facts}`,
  }),
  social: (i) => ({
    system:
      "You write punchy social media posts (LinkedIn + X). Output 3 numbered variants, each under 280 chars, with relevant hashtags. No markdown.",
    user: `Business: ${i.name} (${i.industry}, ${i.city}). Topic / facts: ${i.facts}`,
  }),
  press: (i) => ({
    system:
      "You write professional press releases. Output: dateline, headline, 3 body paragraphs, boilerplate. Plain text.",
    user: `Press release for ${i.name} (${i.industry}, ${i.city}). News / facts: ${i.facts}`,
  }),
  compare: (i) => ({
    system:
      "You produce a head-to-head competitor playbook. Output: 1 short executive summary, then a markdown table comparing SEO, Trust signals, AI visibility, and Engagement, then 3 strategic recommendations.",
    user: `Compare ${i.business} vs ${i.competitor}.`,
  }),
};

export const Route = createFileRoute("/api/studio/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const builder = PROMPTS[body.tool];
        if (!builder) return new Response("Unknown tool", { status: 400 });
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { system, user } = builder(body.inputs ?? {});

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            stream: true,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          return new Response(`AI gateway error ${upstream.status}: ${text}`, {
            status: upstream.status === 429 || upstream.status === 402 ? upstream.status : 500,
          });
        }

        // Re-stream as plain text deltas (newline-delimited) for simple client consumption.
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const reader = upstream.body!.getReader();
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            let buf = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                let idx;
                while ((idx = buf.indexOf("\n")) >= 0) {
                  const line = buf.slice(0, idx).trim();
                  buf = buf.slice(idx + 1);
                  if (!line.startsWith("data:")) continue;
                  const data = line.slice(5).trim();
                  if (data === "[DONE]") continue;
                  try {
                    const json = JSON.parse(data);
                    const delta: string | undefined = json.choices?.[0]?.delta?.content;
                    if (delta) controller.enqueue(encoder.encode(delta));
                  } catch {
                    /* ignore parse errors on keepalive lines */
                  }
                }
              }
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
