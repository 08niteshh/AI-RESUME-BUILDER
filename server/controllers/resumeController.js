const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT = `You are an expert resume writer. Given the user's raw experience and a job description, 
generate a professional, ATS-friendly resume tailored to that specific job. 
Highlight matching skills, use strong action verbs, quantify achievements where possible, 
and format output as clean HTML with sections: Summary, Skills, Experience, Education.`;

const STOP_WORDS = new Set([
  "about",
  "above",
  "after",
  "again",
  "against",
  "also",
  "because",
  "been",
  "being",
  "below",
  "between",
  "both",
  "could",
  "each",
  "from",
  "have",
  "into",
  "more",
  "most",
  "other",
  "over",
  "same",
  "such",
  "than",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "under",
  "very",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
  "your",
  "you"
]);

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text, limit = 24) {
  const counts = new Map();
  const normalized = normalizeText(text);
  const words = normalized.match(/[a-z0-9+#.][a-z0-9+#.-]{2,}/g) || [];

  for (const word of words) {
    if (STOP_WORDS.has(word) || /^\d+$/.test(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([keyword]) => keyword);
}

function calculateKeywordInsights(jobDescription, resumeHtml, userSkills) {
  const keywords = extractKeywords(jobDescription);
  const resumeText = normalizeText(`${resumeHtml} ${userSkills || ""}`);

  const present = keywords.filter((keyword) => resumeText.includes(keyword));
  const missing = keywords.filter((keyword) => !resumeText.includes(keyword));
  const score = keywords.length ? Math.round((present.length / keywords.length) * 100) : 0;

  return { score, present, missing };
}

function sanitizeResumeHtml(html) {
  return html
    .replace(/```html|```/gi, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\s(href|src)=["']javascript:[^"']*["']/gi, "");
}

function buildUserPrompt(payload) {
  return `
User profile:
- Full Name: ${payload.fullName || "Not provided"}
- Email: ${payload.email || "Not provided"}
- Phone: ${payload.phone || "Not provided"}
- LinkedIn: ${payload.linkedin || "Not provided"}
- Skills: ${payload.skills || "Not provided"}
- Work Experience: ${payload.workExperience || "Not provided"}
- Education: ${payload.education || "Not provided"}

Job description:
${payload.jobDescription}

Return only valid clean HTML for the resume body. Use semantic headings, paragraphs, and bullet lists. Do not include markdown fences, explanations, scripts, styles, or a full HTML document.
`.trim();
}

function validatePayload(body) {
  const requiredFields = ["fullName", "email", "skills", "workExperience", "education", "jobDescription"];
  const missingFields = requiredFields.filter((field) => !String(body[field] || "").trim());

  if (missingFields.length) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  return null;
}

async function callClaude(payload) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const error = new Error("ANTHROPIC_API_KEY is not configured on the server.");
    error.status = 500;
    throw error;
  }

  const response = await fetch(ANTHROPIC_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(payload) }]
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || "Claude API request failed.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const resumeHtml = data?.content?.find((part) => part.type === "text")?.text?.trim();

  if (!resumeHtml) {
    const error = new Error("Claude returned an empty resume.");
    error.status = 502;
    throw error;
  }

  return sanitizeResumeHtml(resumeHtml);
}

export async function generateResume(req, res) {
  try {
    const validationError = validatePayload(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const resumeHtml = await callClaude(req.body);
    const keywordInsights = calculateKeywordInsights(
      req.body.jobDescription,
      resumeHtml,
      req.body.skills
    );

    return res.json({
      resumeHtml,
      matchScore: keywordInsights.score,
      keywords: {
        present: keywordInsights.present,
        missing: keywordInsights.missing
      }
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || "Unable to generate resume. Please try again."
    });
  }
}
