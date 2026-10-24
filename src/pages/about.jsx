import "./About.css";

/* ---------- EDIT YOUR INFO HERE ---------- */
const journey = [
  {
    role: "TCM",
    where: "KODLAND USA",
    years: "2025 - PRESENT",
  },
  {
    role: "B.S. Computer Science Software Engineering Major",
    where: "Sadat Academy",
    years: "2022 – 2026",
  },
];

const toolkit = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "Python"] },
  { group: "Craft", items: ["Testing Library", "Playwright", "Figma"] },
];

function About() {
  return (
    <section id="about" className="about">
      <div className="about-inner">
        {/* ---------- top heading ---------- */}
        <header className="about-head">
          <div>
            <p className="about-eyebrow">The open notebook</p>
            <h2 className="about-title">A person, not just a stack.</h2>
          </div>
          <p className="about-readme">README / RETAJ</p>
        </header>

        <div className="about-grid">
          {/* ---------- left column ---------- */}
          <div className="about-left">
            <div className="about-intro">
              <figure className="polaroid">
                <img src="/Retaj.png" alt="Retaj" />
                <figcaption>hi, it's me! ♡</figcaption>
              </figure>

              <div>
                <h3 className="about-tagline">
                  Engineer by trade. Curious by default.
                </h3>
                <p className="about-location">
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  Cairo, Egypt · She/Her
                </p>
              </div>
            </div>

            <p className="about-text">
              I’m Retaj, a fresh Software Engineering graduate who believes
              software engineering is more than writing code or building
              websites but it’s about creating personalized experiences that
              reflect the people behind them. That’s exactly why I designed my
              portfolio this way: to give you a glimpse of who I am, beyond my
              code. 
            </p>
            <p className="about-text">
             Throughout my university journey, I explored different tech
              stacks and roles, driven by my curiosity and love for learning.
              Today, I confidently build with the MERN stack — React, Node.js,
              Express.js, and MongoDB — alongside SQL databases, turning ideas
              into meaningful digital experiences.
            </p>

            <p className="about-label">A little of my journey</p>
            <ul className="journey">
              {journey.map((j) => (
                <li key={j.role}>
                  <div>
                    <strong>{j.role}</strong>
                    <span>{j.where}</span>
                  </div>
                  <em>{j.years}</em>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- right column ---------- */}
          <div className="about-right">
            <div className="code-card">
              <div className="code-top">
                <span>retaj.config.ts</span>
                <span>TypeScript</span>
              </div>
              <pre>
                <code>
                  <span className="k">const</span> retaj = {"{"}
                  {"\n"} <span className="p">focus</span>:{" "}
                  <span className="s">"full-stack web"</span>,{"\n"}{" "}
                  <span className="p">caresAbout</span>: [{"\n"}{" "}
                  <span className="s">"accessibility"</span>,{"\n"}{" "}
                  <span className="s">"clean APIs"</span>,{"\n"}{" "}
                  <span className="s">"tiny details"</span>,{"\n"} ],
                  {"\n"} <span className="p">fueledBy</span>:{" "}
                  <span className="s">"coffee &amp; curiosity"</span>,{"\n"}
                  {"}"};
                </code>
              </pre>
            </div>

            <h3 className="toolkit-title">My everyday toolkit</h3>
            {toolkit.map((t) => (
              <div key={t.group} className="toolkit-group">
                <p className="about-label">{t.group}</p>
                <div className="chips">
                  {t.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- bottom banner ---------- */}
        <div className="about-banner">
          <p>
        New stack? Bring it on. I learn fast and love working in teams.
          </p>
          <a href="/resume.pdf" download>
            Download résumé ↓
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
