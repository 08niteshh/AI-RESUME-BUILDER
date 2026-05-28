import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  Moon,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  XCircle
} from "lucide-react";
import React, { useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  skills: "",
  workExperience: "",
  education: "",
  jobDescription: ""
};

const exampleForm = {
  fullName: "Jordan Lee",
  email: "jordan.lee@email.com",
  phone: "(555) 123-4567",
  linkedin: "https://linkedin.com/in/jordanlee",
  skills: "React, Node.js, TypeScript, REST APIs, AWS, CI/CD, accessibility, analytics",
  workExperience:
    "Frontend Engineer at BrightApps for 4 years. Built SaaS dashboards, improved page performance by 35%, led component library rollout, partnered with product and design, mentored 3 junior engineers.",
  education: "B.S. Computer Science, University of Washington",
  jobDescription:
    "We are hiring a Senior Frontend Engineer with strong React, TypeScript, accessibility, performance optimization, API integration, and product collaboration experience. AWS and design systems experience preferred."
};

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [resumeHtml, setResumeHtml] = useState("");
  const [matchScore, setMatchScore] = useState(null);
  const [keywords, setKeywords] = useState({ present: [], missing: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);

  const hasResume = Boolean(resumeHtml);
  const appClass = isDark ? "dark" : "";

  const scoreColor = useMemo(() => {
    if (matchScore === null) return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    if (matchScore >= 80) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    if (matchScore >= 50) return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    return "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300";
  }, [matchScore]);

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function loadExample() {
    setFormData(exampleForm);
    setError("");
  }

  async function generateResume(event) {
    event?.preventDefault();
    setIsLoading(true);
    setError("");
    setResumeHtml("");
    setMatchScore(null);
    setKeywords({ present: [], missing: [] });

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate resume.");
      }

      setResumeHtml(data.resumeHtml);
      setMatchScore(data.matchScore);
      setKeywords(data.keywords || { present: [], missing: [] });
    } catch (err) {
      setError(err.message || "Unable to generate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetOutput() {
    setResumeHtml("");
    setMatchScore(null);
    setKeywords({ present: [], missing: [] });
    setError("");
  }

  function downloadPdf() {
    window.print();
  }

  return (
    <div className={appClass}>
      <main className="app-shell min-h-screen text-slate-950 transition-colors dark:text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="no-print overflow-hidden rounded-[28px] border border-white/70 bg-white/82 shadow-[0_24px_90px_-50px_rgba(15,23,42,0.65)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/74">
            <div className="premium-strip h-1.5" />
            <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.7)] dark:bg-white dark:text-slate-950">
                  <Sparkles size={25} />
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200">
                      <ShieldCheck size={13} />
                      Claude powered
                    </span>
                    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                      ATS optimized
                    </span>
                  </div>
                  <h1 className="text-3xl font-black leading-none sm:text-4xl">AI Resume Builder</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Turn raw career notes and a job description into a sharp, targeted resume with match scoring and keyword intelligence.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:block">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Workflow</p>
                  <p className="text-sm font-black">Profile → Claude → PDF</p>
                </div>
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  onClick={() => setIsDark((value) => !value)}
                  type="button"
                >
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                  {isDark ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          </header>

          <section className="grid flex-1 gap-6 py-6 xl:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]">
            <form className="no-print flex flex-col gap-5" onSubmit={generateResume}>
              <div className="premium-panel p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200">
                      <UserRound size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black">Profile</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                      Add your raw details. Claude will shape the resume.
                      </p>
                    </div>
                  </div>
                  <button
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    onClick={loadExample}
                    type="button"
                  >
                    Use example
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field icon={UserRound} label="Full Name" value={formData.fullName} onChange={(value) => updateField("fullName", value)} required />
                  <Field icon={Mail} label="Email" type="email" value={formData.email} onChange={(value) => updateField("email", value)} required />
                  <Field icon={Phone} label="Phone" value={formData.phone} onChange={(value) => updateField("phone", value)} />
                  <Field label="LinkedIn" value={formData.linkedin} onChange={(value) => updateField("linkedin", value)} />
                </div>

                <div className="mt-4 grid gap-4">
                  <TextArea
                    icon={Code2}
                    label="Skills"
                    rows={3}
                    value={formData.skills}
                    onChange={(value) => updateField("skills", value)}
                    placeholder="React, Node.js, project leadership, analytics..."
                    required
                  />
                  <TextArea
                    icon={BriefcaseBusiness}
                    label="Work Experience"
                    rows={5}
                    value={formData.workExperience}
                    onChange={(value) => updateField("workExperience", value)}
                    placeholder="Paste roles, projects, achievements, metrics, tools, and responsibilities."
                    required
                  />
                  <TextArea
                    icon={GraduationCap}
                    label="Education"
                    rows={3}
                    value={formData.education}
                    onChange={(value) => updateField("education", value)}
                    placeholder="Degrees, certifications, bootcamps, coursework..."
                    required
                  />
                </div>
              </div>

              <div className="premium-panel p-5 sm:p-6">
                <TextArea
                  icon={FileText}
                  label="Paste Job Description here"
                  rows={10}
                  value={formData.jobDescription}
                  onChange={(value) => updateField("jobDescription", value)}
                  placeholder="Paste the full job description so the resume can mirror the right keywords and priorities."
                  required
                />
              </div>

              {error ? (
                <div className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                  <AlertCircle className="mt-0.5 shrink-0" size={18} />
                  <p>{error}</p>
                </div>
              ) : null}

              <button
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-base font-black text-white shadow-[0_22px_50px_-22px_rgba(15,23,42,0.85)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_26px_70px_-24px_rgba(20,184,166,0.75)] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles className="transition group-hover:scale-110" size={20} />}
                {isLoading ? "Generating..." : hasResume ? "Regenerate Resume" : "Generate Resume"}
              </button>
            </form>

            <div className="flex flex-col gap-5">
              <div className="premium-panel no-print flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black">Resume Output</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Review the generated HTML resume, score, and keyword coverage.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hasResume ? (
                    <>
                      <button
                        className="action-button"
                        onClick={resetOutput}
                        type="button"
                      >
                        <ArrowLeft size={16} />
                        Edit
                      </button>
                      <button
                        className="action-button"
                        onClick={generateResume}
                        type="button"
                      >
                        <RefreshCw size={16} />
                        Regenerate
                      </button>
                      <button
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-500 hover:shadow-md"
                        onClick={downloadPdf}
                        type="button"
                      >
                        <Download size={16} />
                        Download as PDF
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              {hasResume ? (
                <div className="no-print grid gap-4 sm:grid-cols-[160px_1fr]">
                  <div className={`rounded-3xl p-4 shadow-sm ${scoreColor}`}>
                    <div className="text-sm font-semibold">Match Score</div>
                    <div className="mt-1 text-3xl font-black">{matchScore}%</div>
                  </div>

                  <div className="rounded-3xl border border-white/70 bg-white/86 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/76">
                    <div className="mb-3 flex items-center gap-2 text-sm font-black">
                      <BriefcaseBusiness size={16} />
                      Keyword Highlights
                    </div>
                    <KeywordList title="Present" items={keywords.present} tone="present" />
                    <KeywordList title="Missing" items={keywords.missing} tone="missing" />
                  </div>
                </div>
              ) : null}

              <div
                id="resume-print-area"
                className="resume-stage min-h-[720px] rounded-[30px] border border-white/75 bg-white p-5 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.75)] dark:border-white/10 dark:bg-slate-950 sm:p-8"
              >
                {isLoading ? <ResumeSkeleton /> : null}

                {!isLoading && hasResume ? (
                  <article
                    className="resume-output animate-fadeIn text-slate-800 dark:text-slate-100"
                    dangerouslySetInnerHTML={{ __html: resumeHtml }}
                  />
                ) : null}

                {!isLoading && !hasResume ? (
                  <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-950 text-white shadow-[0_22px_50px_-22px_rgba(15,23,42,0.7)] dark:bg-white dark:text-slate-950">
                      <FileText size={34} />
                    </div>
                    <h3 className="text-2xl font-black">Your tailored resume will appear here</h3>
                    <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                      Fill out your profile and paste a job description to generate a clean,
                      ATS-friendly resume.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
        {Icon ? <Icon size={15} /> : null}
        {label}
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:border-slate-800 dark:bg-slate-950/90 dark:focus:border-teal-400 dark:focus:ring-teal-950"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

function TextArea({ icon: Icon, label, value, onChange, rows, placeholder, required = false }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
        {Icon ? <Icon size={15} /> : null}
        {label}
      </span>
      <textarea
        className="w-full resize-y rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:border-slate-800 dark:bg-slate-950/90 dark:focus:border-teal-400 dark:focus:ring-teal-950"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
      />
    </label>
  );
}

function KeywordList({ title, items, tone }) {
  const isPresent = tone === "present";
  const Icon = isPresent ? CheckCircle2 : XCircle;
  const pillClass = isPresent
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-900"
    : "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";

  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
        <Icon size={14} />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${pillClass}`} key={`${title}-${item}`}>
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500 dark:text-slate-400">None yet</span>
        )}
      </div>
    </div>
  );
}

function ResumeSkeleton() {
  return (
    <div className="animate-pulseSoft space-y-6">
      <div>
        <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      {[1, 2, 3, 4].map((section) => (
        <div className="space-y-3" key={section}>
          <div className="h-5 w-44 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-11/12 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export default App;
