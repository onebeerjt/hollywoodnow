const theaters = [
  {
    name: "CMX Brickell City Centre",
    area: "Downtown / Brickell",
    vibe: "Dolby + VIP",
    distance: "0.8 mi",
    color: "#ff6b4a"
  },
  {
    name: "Silverspot Cinema",
    area: "Downtown / Museum Park",
    vibe: "Luxury + Bar",
    distance: "1.2 mi",
    color: "#63d2ff"
  },
  {
    name: "Landmark at Merrick Park",
    area: "Coconut Grove",
    vibe: "Arthouse + Curated",
    distance: "4.9 mi",
    color: "#ffd166"
  },
  {
    name: "AMC Sunset Place 24",
    area: "South Miami",
    vibe: "IMAX + Prime",
    distance: "7.8 mi",
    color: "#6ef2a5"
  }
];

const nowPlaying = [
  {
    title: "Neon Tide",
    rating: "R",
    runtime: "112m",
    genre: "Noir Thriller",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    showtimes: ["1:05", "3:40", "6:20", "9:55"],
    formats: ["Laser", "Dolby"],
    critic: 92,
    crowd: 88
  },
  {
    title: "Solar Choir",
    rating: "PG-13",
    runtime: "128m",
    genre: "Sci-Fi Epic",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
    showtimes: ["12:20", "2:55", "5:30", "8:10"],
    formats: ["IMAX", "Prime"],
    critic: 84,
    crowd: 91
  },
  {
    title: "Afterhours in Havana",
    rating: "PG",
    runtime: "104m",
    genre: "Romance / Music",
    poster: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80",
    showtimes: ["11:10", "1:45", "4:20", "7:05", "9:30"],
    formats: ["Laser"],
    critic: 79,
    crowd: 86
  }
];

const upcoming = [
  {
    title: "Starlight Heist",
    release: "Feb 21",
    days: "11 days",
    buzz: "Festival breakout, neon caper energy.",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
    tags: ["Crime", "Synth", "Wide Release"],
    hype: 86
  },
  {
    title: "Palms at Dawn",
    release: "Mar 07",
    days: "26 days",
    buzz: "Miami-set coming-of-age with sea haze vibes.",
    poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
    tags: ["Indie", "A24", "Limited"],
    hype: 77
  },
  {
    title: "The Archivist",
    release: "Mar 14",
    days: "33 days",
    buzz: "Spy thriller from a prestige director.",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=900&q=80",
    tags: ["Thriller", "Adult", "Premium"],
    hype: 91
  }
];

const secretScreenings = [
  {
    venue: "AMC Sunset Place 24",
    time: "Wed 7:30 PM",
    runtime: "118m",
    notes: "Confidential Screening · No Passes",
    candidates: [
      { title: "Starlight Heist", probability: 62 },
      { title: "The Archivist", probability: 22 },
      { title: "Solar Choir", probability: 16 }
    ]
  },
  {
    venue: "CMX Brickell City Centre",
    time: "Thu 8:15 PM",
    runtime: "102m",
    notes: "Mystery Preview · Rating TBA",
    candidates: [
      { title: "Palms at Dawn", probability: 54 },
      { title: "Afterhours in Havana", probability: 28 },
      { title: "Neon Tide", probability: 18 }
    ]
  }
];

const watchlist = [
  {
    title: "The Archivist",
    status: "Premiere in 33 days",
    signal: "High",
    percent: 91
  },
  {
    title: "Palms at Dawn",
    status: "Limited release soon",
    signal: "Medium",
    percent: 77
  },
  {
    title: "Starlight Heist",
    status: "Wide release",
    signal: "High",
    percent: 86
  }
];

export default function Home() {
  return (
    <main className="reel">
      <header className="reel__top">
        <div className="brand">
          <div className="brand__mark">ReelPulse</div>
          <div className="brand__sub">Downtown Miami Motion Feed</div>
        </div>
        <nav className="topnav">
          <button className="pill is-live">Live</button>
          <button className="pill">Upcoming</button>
          <button className="pill">Secret</button>
          <button className="pill">Saved</button>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Your Miami cinema command center</p>
          <h1>
            Track every release, every showtime, and every mystery screening —
            all in one addictive scroll.
          </h1>
          <p className="lede">
            Downtown Miami focus. CMX, Silverspot, Landmark, AMC. Live showtime
            grids, upcoming drops, and a smart “Confidential” predictor based on
            runtime, release windows, and format clues.
          </p>
          <div className="hero__actions">
            <button className="cta">Save My Radar</button>
            <button className="ghost">Share with a film friend</button>
          </div>
        </div>
        <div className="hero__panel">
          <div className="panel__header">
            <span>Tonight’s vibe</span>
            <strong>Rainy neon thriller night</strong>
          </div>
          <div className="panel__grid">
            <div>
              <p className="stat__label">Your radius</p>
              <p className="stat__value">5.2 mi</p>
            </div>
            <div>
              <p className="stat__label">Showtimes loaded</p>
              <p className="stat__value">86</p>
            </div>
            <div>
              <p className="stat__label">Confidential odds</p>
              <p className="stat__value">62%</p>
            </div>
          </div>
          <div className="panel__footer">
            <span>Next auto-refresh in 12 min</span>
            <button className="mini">Refresh</button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <h2>Downtown Miami Cinemas</h2>
            <p>Swipe to jump between theaters and lock your favorites.</p>
          </div>
          <div className="chip-row">
            {theaters.map((theater) => (
              <button
                key={theater.name}
                className="chip"
                style={{ borderColor: theater.color, color: theater.color }}
              >
                <span className="chip__dot" style={{ background: theater.color }} />
                {theater.name}
              </button>
            ))}
          </div>
        </div>
        <div className="theater-grid">
          {theaters.map((theater) => (
            <article key={theater.name} className="theater">
              <div className="theater__top">
                <div>
                  <h3>{theater.name}</h3>
                  <p>{theater.area}</p>
                </div>
                <span className="distance">{theater.distance}</span>
              </div>
              <div className="theater__meta">
                <span>{theater.vibe}</span>
                <button className="mini">Pin</button>
              </div>
              <div className="time-row">
                {nowPlaying[0].showtimes.slice(0, 4).map((time) => (
                  <span key={time} className="time">
                    {time}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <h2>Now Playing Near You</h2>
            <p>Tap a title to open the full detail sheet and deep-link out.</p>
          </div>
          <div className="toggle-row">
            <button className="pill is-live">Tonight</button>
            <button className="pill">Tomorrow</button>
            <button className="pill">This weekend</button>
          </div>
        </div>
        <div className="rail">
          {nowPlaying.map((movie) => (
            <article key={movie.title} className="poster-card">
              <div className="poster" style={{ backgroundImage: `url(${movie.poster})` }} />
              <div className="poster-card__body">
                <div>
                  <h3>{movie.title}</h3>
                  <p>
                    {movie.genre} · {movie.runtime} · {movie.rating}
                  </p>
                </div>
                <div className="score-row">
                  <div>
                    <span className="score">{movie.critic}</span>
                    <span className="score__label">Critic</span>
                  </div>
                  <div>
                    <span className="score">{movie.crowd}</span>
                    <span className="score__label">Crowd</span>
                  </div>
                </div>
                <div className="tag-row">
                  {movie.formats.map((format) => (
                    <span key={format} className="tag">
                      {format}
                    </span>
                  ))}
                </div>
                <div className="time-row">
                  {movie.showtimes.map((time) => (
                    <span key={time} className="time">
                      {time}
                    </span>
                  ))}
                </div>
                <button className="cta">Save screening</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <h2>Upcoming Release Radar</h2>
            <p>All the drops you care about, aligned with your vibe profile.</p>
          </div>
          <button className="ghost">Subscribe to calendar</button>
        </div>
        <div className="upcoming-grid">
          {upcoming.map((movie) => (
            <article key={movie.title} className="upcoming-card">
              <div className="upcoming-card__poster" style={{ backgroundImage: `url(${movie.poster})` }} />
              <div className="upcoming-card__body">
                <div>
                  <div className="release-row">
                    <span className="release">{movie.release}</span>
                    <span className="days">{movie.days}</span>
                  </div>
                  <h3>{movie.title}</h3>
                  <p>{movie.buzz}</p>
                </div>
                <div className="tag-row">
                  {movie.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="meter">
                  <div className="meter__label">Hype match</div>
                  <div className="meter__bar">
                    <span style={{ width: `${movie.hype}%` }} />
                  </div>
                  <div className="meter__value">{movie.hype}%</div>
                </div>
                <button className="ghost">Add to watchlist</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <h2>Confidential Screening Decoder</h2>
            <p>
              We infer likely titles using runtime windows, MPAA hints, and
              release windows. Percentages are probability estimates.
            </p>
          </div>
          <button className="pill">Edit rules</button>
        </div>
        <div className="secret-grid">
          {secretScreenings.map((screening) => (
            <article key={screening.venue} className="secret-card">
              <div className="secret-card__header">
                <div>
                  <h3>{screening.venue}</h3>
                  <p>{screening.time}</p>
                </div>
                <span className="runtime">{screening.runtime}</span>
              </div>
              <p className="secret-note">{screening.notes}</p>
              <div className="secret-list">
                {screening.candidates.map((candidate) => (
                  <div key={candidate.title} className="secret-row">
                    <span>{candidate.title}</span>
                    <div className="secret-meter">
                      <span style={{ width: `${candidate.probability}%` }} />
                    </div>
                    <strong>{candidate.probability}%</strong>
                  </div>
                ))}
              </div>
              <button className="cta">Notify me if confirmed</button>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <h2>Saved Watchlist</h2>
            <p>Everything you saved, sorted by urgency and hype.</p>
          </div>
          <button className="ghost">Export as CSV</button>
        </div>
        <div className="watchlist">
          {watchlist.map((item) => (
            <article key={item.title} className="watch">
              <div>
                <h3>{item.title}</h3>
                <p>{item.status}</p>
              </div>
              <div className="watch__meta">
                <span className="signal">{item.signal}</span>
                <span className="signal-value">{item.percent}%</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <h3>ReelPulse Miami</h3>
          <p>
            Built for Letterboxd & IMDb obsessives. Want full data hookups?
            Connect your showtime sources and we&apos;ll light it up.
          </p>
        </div>
        <div className="footer__meta">
          <span>Last sync: 2 mins ago</span>
          <button className="mini">Manage sources</button>
        </div>
      </footer>
    </main>
  );
}
