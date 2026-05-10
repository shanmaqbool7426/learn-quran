import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"] ?? "placeholder",
});

router.post("/tafseer", async (req, res) => {
  try {
    const { surahName, ayahNumber, arabicText, translation, surahId, language = "English" } = req.body as {
      surahName: string;
      ayahNumber: number;
      arabicText: string;
      translation: string;
      surahId: number;
      language?: string;
    };

    if (!arabicText) {
      res.status(400).json({ error: "arabicText is required" });
      return;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable Islamic scholar specializing in Quran tafseer (exegesis). 
Provide insightful, accurate tafseer explanations that are educational and spiritually enriching.
Keep responses concise but comprehensive — around 150-200 words.
Include: 1) Core meaning/theme, 2) Historical/revelation context if relevant, 3) Key lessons for Muslims today.
Be respectful and scholarly in tone.
IMPORTANT: Respond entirely in ${language}. If ${language} is not English, still use proper Islamic terms.`,
        },
        {
          role: "user",
          content: `Provide tafseer for this ayah:

Surah: ${surahName} (${surahId})
Ayah: ${ayahNumber}
Arabic: ${arabicText}
Translation: ${translation}

Please explain the meaning, context, and key lessons from this verse. Respond in ${language}.`,
        },
      ],
    });

    const tafseer = response.choices[0]?.message?.content ?? "";
    res.json({ tafseer, surahId, ayahNumber });
  } catch (err) {
    console.error("Tafseer error:", err);
    res.status(500).json({ error: "Failed to generate tafseer" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 1024,
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are an Islamic scholar AI assistant with deep knowledge of the Quran, Hadith, Islamic jurisprudence (Fiqh), and Islamic history.

Guidelines:
- Answer questions about Islam, Quran, Hadith, prayer, fasting, Zakat, Hajj, Islamic ethics and morals
- Cite Quranic verses and hadith when relevant (include reference: Surah:Ayah or collection/number)
- Be balanced, scholarly, and represent mainstream Islamic views
- For sensitive jurisprudence topics, mention that scholars may differ
- Use Arabic terms with English explanations when appropriate
- Keep responses concise and practical
- Always be respectful and compassionate
- If asked about something outside Islamic scholarship, politely redirect to Islamic topics`,
        },
        ...messages,
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Chat error:", err);
    res.write(`data: ${JSON.stringify({ error: "Failed to get response" })}\n\n`);
    res.end();
  }
});

router.post("/insights", async (req, res) => {
  try {
    const { arabic, translation, reference } = req.body as {
      arabic: string;
      translation: string;
      reference: string;
    };

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      max_completion_tokens: 200,
      messages: [
        {
          role: "system",
          content: "You are an Islamic scholar. Provide a brief, inspiring insight (2-3 sentences max) about the given Quran verse. Focus on practical application for daily life.",
        },
        {
          role: "user",
          content: `Verse: "${translation}" (${reference})\nArabic: ${arabic}\n\nGive a brief inspiring insight.`,
        },
      ],
    });

    const insight = response.choices[0]?.message?.content ?? "";
    res.json({ insight });
  } catch (err) {
    console.error("Insights error:", err);
    res.status(500).json({ error: "Failed to generate insight" });
  }
});

export default router;
