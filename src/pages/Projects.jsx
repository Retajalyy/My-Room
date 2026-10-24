import "./Projects.css";

/* ---------- EDIT YOUR PROJECTS HERE ----------
   image: optional. Save the picture in public/projects/ and write
          the path like "/projects/my-app.png". Leave "" for a colored placeholder.
   live / code: your links. Leave "" to hide a button.
-------------------------------------------------- */

const projects = [
  {
    title: "Academia",
    year: "2026",
    description:
      "A Complete university admission system from admission to graduation....",
    tags: ["Flutter", "Dart", "Supbase"],
  video: "/Academia.MP4",
    live: "",
    code: "",
  },
  {
    title: "Project Two",
    year: "2025",
    description:
      "Describe what you built, who it's for, and one thing you're proud of.",
    tags: ["TypeScript", "Next.js", "Figma"],
    image: "",
    live: "",
    code: "",
  },
  {
    title: "Project Three",
    year: "2025",
    description:
      "Another project. Keep it to one or two lines so the cards stay tidy.",
    tags: ["Python", "Playwright"],
    image: "",
    live: "",
    code: "",
  },
];

function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="projects-inner">
        <header className="projects-head">
          <div>
            <p className="projects-eyebrow">A few things I've built</p>
            <h2 className="projects-title">Selected projects.</h2>
          </div>
          <p className="projects-count">
            {String(projects.length).padStart(2, "0")} projects
          </p>
        </header>

        <div className="projects-grid">
          {projects.map((p) => (
            <article key={p.title} className="project-card">
              {/* preview area, styled like a tiny browser window */}
              <div className="project-preview">
                <div className="project-dots">
                  <i />
                  <i />
                  <i />
                </div>
                {p.video ? (
  <video
    src={p.video}
    poster={p.image || undefined}
    autoPlay
    muted
    loop
    playsInline
  />
) : p.image ? (
  <img src={p.image} alt={p.title} />
) : (
  <span className="project-initial">{p.title.charAt(0)}</span>
)}
              </div>

              <div className="project-body">
                <div className="project-top">
                  <h3>{p.title}</h3>
                  <span className="project-year">{p.year}</span>
                </div>
                <p className="project-desc">{p.description}</p>

                <div className="project-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="project-chip">{t}</span>
                  ))}
                </div>

                <div className="project-links">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer">Live demo ↗</a>
                  )}
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noreferrer">Source code ↗</a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;