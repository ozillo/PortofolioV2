import "./ProjectCard.css";

export default function ProjectCard({
  title,
  description,
  image,
  tags = [],
  url,
}) {
  return (
    <article className="project-card">
      <div className="project-media">
        <img src={image} alt={title} loading="lazy" />
      </div>

      <div className="project-body">
        <h3 className="project-title">{title}</h3>
        {description && <p className="project-desc">{description}</p>}

        {(tags?.length > 0 || url) && (
          <div className="project-meta">
            {tags?.length > 0 && (
              <ul className="project-tags" aria-label="Tecnologías">
                {tags.map((t) => (
                  <li key={t} className="tag">{t}</li>
                ))}
              </ul>
            )}

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                aria-label={`Visitar ${title}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20m0 2c1.93 0 3.68.78 4.95 2.05A6.97 6.97 0 0 0 12 9c-1.93 0-3.68-.78-4.95-2.05A6.97 6.97 0 0 0 12 4m0 16a8 8 0 0 1-7.75-6h4.26A10.5 10.5 0 0 0 12 16c1.93 0 3.68-.78 4.95-2.05c.5-.5.94-1.05 1.3-1.65h4.26A8 8 0 0 1 12 20Z"
                  />
                </svg>
                <span>Visitar</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
