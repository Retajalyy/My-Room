import { useState } from "react";
import "./contact.css";

/* ---------- EDIT YOUR INFO HERE ---------- */
const EMAIL = "Retajalii95@gmail.com";
const GITHUB = "https://github.com/Retajalyy";
const LINKEDIN = "https://www.linkedin.com/in/retajali/";

/* Paste your Formspree link here to receive notes in your inbox,
   for example "https://formspree.io/f/abcdwxyz".
   Leave "" and the button will open the visitor's email app instead. */
const FORM_ENDPOINT = "https://formspree.io/f/xzeepojo";

const topics = ["A role", "A project", "Just saying hi"];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [topic, setTopic] = useState(topics[0]);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: ignore */
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    /* no Formspree link yet: open the visitor's email app with the note filled in */
    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent(`${topic}: note from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n${form.name} (${form.email})`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, topic }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        {/* ---------- heading ---------- */}
        <header className="contact-head">
          <div>
            <p className="contact-eyebrow">The bedside telephone</p>
            <h2 className="contact-title">Let&rsquo;s make something lovely.</h2>
          </div>
          <p className="contact-inbox">INBOX / OPEN</p>
        </header>

        <div className="contact-grid">
          {/* ---------- left: info card ---------- */}
          <aside className="contact-card">
            <div className="contact-photo">
              <img
                src="/phone.jpg"
                alt="A pink telephone on a bedside table"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>

            <h3 className="contact-card-title">Good things begin with a little hello.</h3>

            <p className="contact-label">Prefer email?</p>
            <div className="contact-email">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <button type="button" onClick={copyEmail} aria-label="Copy email address">
                {copied ? (
                  <span className="copied">Copied!</span>
                ) : (
                  <svg {...iconProps} width="16" height="16">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V6a2 2 0 012-2h9" />
                  </svg>
                )}
              </button>
            </div>

            <hr className="contact-rule" />

            <p className="contact-open">
              <i /> Open to full-stack engineering roles
            </p>

            <div className="contact-links">
              <a href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </aside>

          {/* ---------- right: note form ---------- */}
          <div className="contact-form-wrap">
            <div className="contact-form-head">
              <h3>Leave a little note</h3>
              <svg {...iconProps} width="22" height="22">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="M3.5 7l8.5 6 8.5-6" />
              </svg>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-row">
                <label>
                  <span className="contact-field">Your name</span>
                  <input
                    type="text"
                    required
                    placeholder="Jordan Lee"
                    value={form.name}
                    onChange={update("name")}
                  />
                </label>
                <label>
                  <span className="contact-field">Email address</span>
                  <input
                    type="email"
                    required
                    placeholder="jordan@studio.co"
                    value={form.email}
                    onChange={update("email")}
                  />
                </label>
              </div>

              <p className="contact-field">What brings you here?</p>
              <div className="topic-chips">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`topic-chip ${topic === t ? "active" : ""}`}
                    aria-pressed={topic === t}
                    onClick={() => setTopic(t)}
                  >
                    {topic === t && <span className="tick">✓</span>}
                    {t}
                  </button>
                ))}
              </div>

              <label>
                <span className="contact-field">Your message</span>
                <textarea
                  required
                  rows={6}
                  placeholder="Hi Retaj! I loved exploring your room and I'd love to chat about..."
                  value={form.message}
                  onChange={update("message")}
                />
              </label>

              <div className="contact-actions">
                <button type="submit" className="send-btn" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send my note"}
                  <svg {...iconProps} width="16" height="16">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
                <span className="contact-reply">Usually replies in 1–2 workdays.</span>
              </div>

              {status === "sent" && (
                <p className="contact-status ok">Thank you! Your note is on its way. ♡</p>
              )}
              {status === "error" && (
                <p className="contact-status bad">
                  Something went wrong. Please try again, or email me directly.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* ---------- bottom banner ---------- */}
        <div className="contact-banner">
          <svg {...iconProps} width="15" height="15">
            <path d="M12 21s-7-4.6-9.3-9A5.2 5.2 0 0112 6.5 5.2 5.2 0 0121.3 12C19 16.4 12 21 12 21z" />
          </svg>
          <em>No bots, no templates. Just me, a keyboard and a coffee.</em>
        </div>
      </div>
    </section>
  );
}

export default Contact;