type ArticleProps = {
  title: string;
  year: number;
  source: string;
  summary: string;
  url?: string;
};

export default function Article({
  title,
  year,
  source,
  summary,
  url
}: ArticleProps) {
  return (
    <article className="article">
      <header className="article__header">
        <p className="article__eyebrow">{source}</p>
        <h1 className="article__title">{title}</h1>
        <p className="article__meta">{year}</p>
      </header>
      <p className="article__summary">{summary}</p>
      <footer className="article__footer">
        <span className="article__rule" aria-hidden />
        {url ? (
          <a
            className="article__link"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Read on source
          </a>
        ) : (
          <span className="article__note">Swipe for the next issue</span>
        )}
      </footer>
    </article>
  );
}
