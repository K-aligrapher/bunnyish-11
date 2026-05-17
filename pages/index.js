import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const THUMBS = [
  'linear-gradient(135deg,#f5c542,#e8985a)',
  'linear-gradient(135deg,#e8985a,#d4a327)',
  'linear-gradient(135deg,#ffe699,#f5c542)',
  'linear-gradient(135deg,#f0d68a,#c99a22)',
  'linear-gradient(135deg,#ffd966,#e8985a)',
  'linear-gradient(135deg,#d4a327,#f5c542)',
]

const CATEGORIES = [
  { key: 'all', label: 'All Posts', icon: '📋' },
  { key: 'Short Story', label: 'Stories', icon: '📖' },
  { key: 'Poetry', label: 'Poems', icon: '🌸' },
  { key: 'Essay', label: 'Blog', icon: '✏️' },
  { key: 'Flash Fiction', label: 'Flash Fiction', icon: '⚡' },
  { key: 'Personal', label: 'Personal', icon: '💭' },
]

export default function Home({ posts: initialPosts }) {
  const [posts] = useState(initialPosts)
  const [modal, setModal] = useState(null)
  const [activeCat, setActiveCat] = useState('all')

  const filtered = activeCat === 'all' ? posts : posts.filter(p => p.category === activeCat)

  return (
    <>
      <Head>
        <title>Bunnyish — Stories, Poems & Blog</title>
        <meta name="description" content="A cute personal journal of stories, poems, and blog posts" />
      </Head>

      <div className="root">
        {/* ── HEADER ── */}
        <header className="hdr">
          <div className="hdr-inner">
            <Link href="/" className="brand-link">
              <span className="bunny-icon">🐰</span>
              <h1 className="brand">Bunnyish</h1>
            </Link>
            <nav className="nav">
              <Link href="/" className="nl active">Home</Link>
              <Link href="/write" className="nl">Write</Link>
              <Link href="/admin" className="nl">Admin</Link>
            </nav>
          </div>
        </header>

        <div className="layout">
          {/* ── LEFT SIDEBAR ── */}
          <aside className="sidebar">
            <div className="sb-section">
              <p className="sb-title">Categories</p>
              <ul className="cat-list">
                {CATEGORIES.map(c => (
                  <li
                    key={c.key}
                    className={`cat-item ${activeCat === c.key ? 'active' : ''}`}
                    onClick={() => setActiveCat(c.key)}
                  >
                    <span className="cat-icon">{c.icon}</span>
                    <span className="cat-label">{c.label}</span>
                    {activeCat === c.key && <span className="cat-dot" />}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sb-section">
              <p className="sb-title">About</p>
              <p className="sb-about">"A cozy little corner where thoughts become stories and feelings become poems 🐇"</p>
            </div>

            <div className="sb-section">
              <p className="sb-title">Stats</p>
              <div className="sb-stat"><span>Total Posts</span><strong>{posts.length}</strong></div>
              <div className="sb-stat"><span>Categories</span><strong>{new Set(posts.map(p => p.category)).size}</strong></div>
            </div>

            {/* Decorative bunny */}
            <div className="sb-bunny">
              <svg viewBox="0 0 60 70" fill="none" width="50">
                <path d="M22 30 Q18 10 22 4 Q25 -1 28 4 Q32 14 28 30" stroke="var(--yellow-dark)" strokeWidth="1.5" fill="none" />
                <path d="M35 30 Q31 10 35 4 Q38 -1 41 4 Q45 14 41 30" stroke="var(--yellow-dark)" strokeWidth="1.5" fill="none" />
                <ellipse cx="31" cy="40" rx="16" ry="13" stroke="var(--yellow-dark)" strokeWidth="1.5" fill="none" />
                <path d="M25 38 Q27 35 29 38" stroke="var(--brown-soft)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M33 38 Q35 35 37 38" stroke="var(--brown-soft)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <ellipse cx="31" cy="42" rx="2" ry="1.5" fill="var(--pink-nose)" />
                <path d="M28 44 Q31 47 34 44" stroke="var(--brown-soft)" strokeWidth="1" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="main">
            {/* Hero card */}
            {filtered[0] && (
              <div className="hero" onClick={() => setModal(filtered[0])}>
                <div className="hero-thumb" style={{ background: THUMBS[filtered[0].thumb ?? 0] }}>
                  <span className="hero-star">✦</span>
                </div>
                <div className="hero-body">
                  <span className="tag">{filtered[0].category}</span>
                  <h2>{filtered[0].title}</h2>
                  <p className="meta">
                    {new Date(filtered[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    {Math.max(1, Math.ceil(filtered[0].body.split(' ').length / 200))} min read
                  </p>
                  <p className="exc">{filtered[0].excerpt}</p>
                  <button className="read-btn">Continue Reading →</button>
                </div>
              </div>
            )}

            {/* Section divider */}
            <div className="divider">
              <span>🐰</span>
              <span className="divider-text">{activeCat === 'all' ? 'All Posts' : CATEGORIES.find(c => c.key === activeCat)?.label}</span>
              <span>🐰</span>
            </div>

            {/* Post grid */}
            <div className="grid">
              {filtered.length === 0 && (
                <div className="empty">No posts here yet… write your first story! 🐇</div>
              )}
              {filtered.slice(1).map(p => (
                <div key={p.id} className="card" onClick={() => setModal(p)}>
                  <div className="card-thumb" style={{ background: THUMBS[p.thumb ?? 0] }} />
                  <div className="card-body">
                    <span className="tag">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p className="card-exc">{p.excerpt}</p>
                    <p className="meta">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' · '}
                      {Math.max(1, Math.ceil(p.body.split(' ').length / 200))} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <span className="f-brand">Bunnyish</span>
          <span className="f-sub">Written with ^ ^</span>
        </footer>

        {/* ── MODAL ── */}
        {modal && (
          <div className="overlay" onClick={e => e.target.classList.contains('overlay') && setModal(null)}>
            <div className="modal">
              <button className="mx" onClick={() => setModal(null)}>✕</button>
              <span className="m-cat">{modal.category}</span>
              <h2 className="m-title">{modal.title}</h2>
              <p className="m-meta">
                {new Date(modal.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {' · '}
                {Math.max(1, Math.ceil(modal.body.split(' ').length / 200))} min read
              </p>
              <div className="m-body">
                {(() => {
                  const textPart = modal.body.split('---IMAGES---')[0]
                  const imgPart = modal.body.split('---IMAGES---')[1] || ''
                  const imgMatches = [...imgPart.matchAll(/\[IMG_\d+\](.*?)\[\/IMG\]/gs)]
                  const capMatches = [...imgPart.matchAll(/\[CAPTION\](.*?)\[\/CAPTION\]/gs)]
                  return (
                    <>
                      {textPart.split('\n').map((l, i) => l.trim() ? <p key={i}>{l}</p> : null)}
                      {imgMatches.length > 0 && (
                        <div className="m-images">
                          {imgMatches.map((m, i) => (
                            <figure key={i} className="m-fig">
                              <img src={m[1]} alt={capMatches[i]?.[1] || `Image ${i + 1}`} className="m-img" />
                              {capMatches[i]?.[1] && <figcaption className="m-figcap">{capMatches[i][1]}</figcaption>}
                            </figure>
                          ))}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .root { min-height: 100vh; background: var(--bg-deep); }

        /* HEADER */
        .hdr {
          position: sticky; top: 0; z-index: 50;
          background: var(--header-bg); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border); padding: 0 1.5rem;
        }
        .hdr-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; height: 56px; }
        .brand-link { display: flex; align-items: center; gap: 0.4rem; }
        .bunny-icon { font-size: 1.5rem; }
        .brand {
          font-family: 'Comfortaa', cursive; font-size: 1.4rem; font-weight: 700;
          background: var(--gradient-brand);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .nav { display: flex; gap: 0.25rem; }
        .nl {
          font-family: 'Quicksand', sans-serif; font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text-muted); padding: 0.4rem 0.9rem; border-radius: 10px;
          transition: var(--transition);
        }
        .nl:hover { color: var(--text-primary); background: var(--bg-hover); }
        .nl.active { color: var(--text-accent); background: var(--yellow-glow); }

        /* LAYOUT */
        .layout { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 220px 1fr; gap: 2rem; padding: 1.5rem; min-height: calc(100vh - 56px - 60px); }

        /* SIDEBAR */
        .sidebar {
          position: sticky; top: 72px; height: fit-content; max-height: calc(100vh - 90px); overflow-y: auto;
          display: flex; flex-direction: column; gap: 1.5rem;
          padding: 1.2rem; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
        }
        .sb-title {
          font-family: 'Quicksand', sans-serif; font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 0.7rem;
          padding-bottom: 0.4rem; border-bottom: 1px solid var(--border);
        }
        .cat-list { list-style: none; display: flex; flex-direction: column; gap: 0.2rem; }
        .cat-item {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 0.65rem; border-radius: 10px;
          cursor: pointer; transition: var(--transition);
          font-family: 'Nunito', sans-serif; font-size: 0.82rem;
          color: var(--text-secondary); position: relative;
        }
        .cat-item:hover { background: var(--bg-hover); color: var(--text-primary); }
        .cat-item.active {
          background: var(--yellow-glow); color: var(--text-accent); font-weight: 700;
        }
        .cat-icon { font-size: 0.95rem; }
        .cat-label { flex: 1; }
        .cat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--yellow); }

        .sb-about { font-size: 0.78rem; line-height: 1.65; color: var(--text-secondary); font-style: italic; }
        .sb-stat {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.3rem 0; border-bottom: 1px dotted var(--border);
          font-family: 'Quicksand', sans-serif; font-size: 0.65rem;
          color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;
        }
        .sb-stat strong { font-family: 'Comfortaa', cursive; font-weight: 700; color: var(--text-accent); font-size: 0.9rem; }
        .sb-bunny { display: flex; justify-content: center; opacity: 0.4; margin-top: 0.5rem; }

        /* MAIN */
        .main { display: flex; flex-direction: column; gap: 1.5rem; }

        /* HERO */
        .hero {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.8rem;
          background: var(--gradient-card); border: 1px solid var(--border);
          border-radius: var(--radius-lg); padding: 1.5rem;
          cursor: pointer; transition: var(--transition); align-items: center;
        }
        .hero:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); }
        .hero-thumb {
          aspect-ratio: 4/3; border-radius: var(--radius);
          display: grid; place-items: center;
        }
        .hero-star { font-size: 2.5rem; opacity: 0.25; }
        .tag {
          display: inline-block; font-family: 'Quicksand', sans-serif;
          font-size: 0.55rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-accent); border: 1px solid var(--border-accent);
          padding: 0.18rem 0.55rem; border-radius: 20px; margin-bottom: 0.5rem;
        }
        .hero-body h2 {
          font-family: 'Comfortaa', cursive; font-size: clamp(1.15rem, 2vw, 1.6rem);
          font-weight: 700; line-height: 1.3; margin-bottom: 0.5rem;
        }
        .meta {
          font-family: 'Quicksand', sans-serif; font-size: 0.58rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 0.6rem;
        }
        .exc { font-size: 0.85rem; line-height: 1.65; color: var(--text-secondary); margin-bottom: 0.8rem; }
        .read-btn {
          font-family: 'Quicksand', sans-serif; font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          background: var(--gradient-brand); color: #fff;
          border: none; padding: 0.55rem 1.1rem; border-radius: 10px;
          cursor: pointer; transition: var(--transition);
        }
        .read-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        /* DIVIDER */
        .divider {
          display: flex; align-items: center; gap: 0.7rem; justify-content: center;
          padding: 0.3rem 0;
        }
        .divider-text {
          font-family: 'Quicksand', sans-serif; font-size: 0.6rem;
          letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted);
        }

        /* GRID */
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
        .card {
          background: var(--gradient-card); border: 1px solid var(--border);
          border-radius: var(--radius); overflow: hidden;
          cursor: pointer; transition: var(--transition);
        }
        .card:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
        .card-thumb { aspect-ratio: 16/9; }
        .card-body { padding: 1rem; }
        .card-body h3 {
          font-family: 'Comfortaa', cursive; font-size: 0.9rem; font-weight: 600;
          line-height: 1.35; margin: 0.25rem 0 0.3rem;
        }
        .card-exc { font-size: 0.78rem; line-height: 1.55; color: var(--text-secondary); margin-bottom: 0.4rem; }
        .empty {
          grid-column: 1 / -1; text-align: center; padding: 3rem;
          font-family: 'Comfortaa', cursive; font-size: 0.95rem;
          color: var(--text-muted);
        }

        /* FOOTER */
        .footer {
          border-top: 1px solid var(--border); padding: 1rem 1.5rem;
          display: flex; justify-content: center; gap: 1rem; align-items: center; flex-wrap: wrap;
        }
        .f-brand { font-family: 'Comfortaa', cursive; font-weight: 700; font-size: 0.9rem; }
        .f-sub { font-family: 'Quicksand', sans-serif; font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); }

        /* MODAL */
        .overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(6px);
          z-index: 100; display: grid; place-items: center; padding: 1.5rem;
        }
        .modal {
          background: var(--bg-card); border: 1px solid var(--border);
          max-width: 640px; width: 100%; max-height: 85vh; overflow-y: auto;
          padding: 2.2rem; border-radius: var(--radius-lg); position: relative;
          border-top: 3px solid var(--yellow);
        }
        .mx {
          position: absolute; top: 0.8rem; right: 1rem;
          background: none; border: none; font-size: 1.1rem;
          color: var(--text-muted); cursor: pointer; transition: var(--transition);
        }
        .mx:hover { color: var(--text-accent); }
        .m-cat {
          font-family: 'Quicksand', sans-serif; font-size: 0.55rem;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--text-accent); display: block; margin-bottom: 0.5rem;
        }
        .m-title { font-family: 'Comfortaa', cursive; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.25; }
        .m-meta {
          font-family: 'Quicksand', sans-serif; font-size: 0.55rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted);
          margin-bottom: 1.3rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);
        }
        .m-body p { font-size: 0.92rem; line-height: 1.85; color: var(--text-secondary); margin-bottom: 0.8rem; }
        .m-images { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.2rem; }
        .m-fig { margin: 0; }
        .m-img { width: 100%; border-radius: var(--radius); display: block; }
        .m-figcap { font-family: 'Quicksand', sans-serif; font-size: 0.7rem; color: var(--text-muted); text-align: center; margin-top: 0.4rem; font-style: italic; }

        /* RESPONSIVE */
        @media (max-width: 800px) {
          .layout { grid-template-columns: 1fr; }
          .sidebar { position: static; flex-direction: row; flex-wrap: wrap; max-height: none; }
          .sb-section { flex: 1; min-width: 180px; }
          .sb-bunny { display: none; }
          .hero { grid-template-columns: 1fr; }
        }
        @media (max-width: 550px) {
          .grid { grid-template-columns: 1fr; }
          .hdr-inner { height: auto; padding: 0.6rem 0; flex-direction: column; gap: 0.4rem; }
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps() {
  if (!supabase) {
    console.error('Supabase client not configured — check env vars')
    return { props: { posts: [] } }
  }
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('Supabase error:', error)
    return { props: { posts: posts ?? [] } }
  } catch (err) {
    console.error('Supabase fetch failed:', err.message)
    return { props: { posts: [] } }
  }
}
