import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const THUMBS = [
  'linear-gradient(135deg,#e8c9a0,#c4895a)',
  'linear-gradient(135deg,#d4b8a0,#8b6050)',
  'linear-gradient(135deg,#c9b89a,#7a5c40)',
  'linear-gradient(135deg,#e0cdb0,#b08060)',
  'linear-gradient(135deg,#d8c4a8,#987058)',
  'linear-gradient(135deg,#ccc0a8,#806848)',
]

export default function Home({ posts: initialPosts }) {
  const [posts, setPosts] = useState(initialPosts)
  const [modal, setModal] = useState(null)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const hero = posts[0]
  const gridPosts = posts.slice(1)

  return (
    <>
      <Head>
        <title>The Story Press</title>
        <meta name="description" content="A personal journal of words and worlds" />
        <meta property="og:title" content="The Story Press" />
        <meta property="og:description" content="A personal journal of words and worlds" />
      </Head>

      <div className="root">
        {/* HEADER */}
        <header className="hdr">
          <div className="hdr-top">
            <span className="label">{today}</span>
            <span className="label">Stories · Fiction · Essays · Poetry</span>
          </div>
          <div className="masthead">
            <h1>The Story Press</h1>
            <p className="sub">A personal journal of words &amp; worlds</p>
          </div>
          <nav className="nav">
            <Link href="/">All Stories</Link>
            <Link href="/write">Write New</Link>
          </nav>
        </header>

        <main className="main">
          {/* HERO */}
          {hero && (
            <div className="hero">
              <div className="hero-img" style={{ background: THUMBS[hero.thumb ?? 0] }}>✦</div>
              <div className="hero-content">
                <span className="cat-tag">{hero.category}</span>
                <h2>{hero.title}</h2>
                <p className="post-meta">
                  {new Date(hero.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  &nbsp;·&nbsp;
                  {Math.max(1, Math.ceil(hero.body.split(' ').length / 200))} min read
                </p>
                <p className="excerpt">{hero.excerpt}</p>
                <button className="read-more" onClick={() => setModal(hero)}>Continue Reading →</button>
              </div>
            </div>
          )}

          {/* SECTION LABEL */}
          <div className="sec-label">
            <span>Recent Stories</span>
          </div>

          {/* GRID */}
          <div className="post-grid">
            {gridPosts.length === 0 && (
              <div className="empty-state">Your next story is waiting to be written…</div>
            )}
            {gridPosts.map((p) => (
              <div key={p.id} className="post-card" onClick={() => setModal(p)}>
                <div className="top-bar" />
                <div className="card-thumb" style={{ background: THUMBS[p.thumb ?? 0] }} />
                <div className="card-body">
                  <span className="cat-tag">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p className="card-exc">{p.excerpt}</p>
                  <p className="post-meta">
                    {new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    &nbsp;·&nbsp;
                    {Math.max(1, Math.ceil(p.body.split(' ').length / 200))} min read
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM */}
          <div className="bottom-cols">
            <div>
              <p className="widget-title">About This Blog</p>
              <p className="about-text">"This is my little corner of the internet — a place where half-formed thoughts become stories, and everyday moments become something worth remembering."</p>
              <div style={{ marginTop: '1.5rem' }}>
                <p className="widget-title">Browse by Tag</p>
                <div className="tag-list">
                  {['Short Story','Flash Fiction','Essay','Poetry','Personal','Memory','Love','Loss'].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="widget-title">Recent Posts</p>
              <ul className="recent-list">
                {posts.slice(0, 6).map(p => (
                  <li key={p.id} onClick={() => setModal(p)}>
                    <span className="recent-title">{p.title}</span>
                    <span className="recent-date">
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1.5rem' }}>
                <p className="widget-title">Stats</p>
                <div className="stats">
                  <div className="stat-row"><span>Total Stories</span><strong>{posts.length}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer>
          <div className="footer-brand">The Story Press</div>
          <p className="label">Written with heart · Powered by Supabase &amp; Vercel</p>
        </footer>

        {/* MODAL */}
        {modal && (
          <div className="overlay" onClick={e => { if (e.target.classList.contains('overlay')) setModal(null) }}>
            <div className="modal">
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
              <span className="modal-cat">{modal.category}</span>
              <h2 className="modal-h2">{modal.title}</h2>
              <p className="modal-meta">
                {new Date(modal.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                &nbsp;·&nbsp;
                {Math.max(1, Math.ceil(modal.body.split(' ').length / 200))} min read
              </p>
              <div className="modal-body">
                {modal.body.split('\n').map((line, i) =>
                  line.trim() ? <p key={i}>{line}</p> : null
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .root { background: var(--cream); min-height: 100vh; }

        /* HEADER */
        .hdr { background: var(--warm-white); border-bottom: 3px double var(--rule); padding: 0 2rem; }
        .hdr-top { display: flex; justify-content: space-between; align-items: center; padding: .75rem 0; border-bottom: 1px solid var(--rule); }
        .label { font-family: 'Josefin Sans', sans-serif; font-size: .66rem; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); }
        .masthead { text-align: center; padding: 2.2rem 0 1.4rem; }
        .masthead h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.8rem,7vw,5.5rem); font-weight: 900; letter-spacing: -.02em; line-height: 1; }
        .sub { font-family: 'Josefin Sans', sans-serif; font-size: .66rem; letter-spacing: .32em; text-transform: uppercase; color: var(--sienna); margin-top: .5rem; }
        .nav { display: flex; justify-content: center; gap: 2.5rem; padding: .85rem 0 .75rem; border-top: 1px solid var(--rule); }
        .nav a { font-family: 'Josefin Sans', sans-serif; font-size: .7rem; letter-spacing: .18em; text-transform: uppercase; color: var(--brown); transition: color .2s; }
        .nav a:hover { color: var(--gold); }

        /* MAIN */
        .main { max-width: 1140px; margin: 0 auto; padding: 3rem 2rem; }

        /* HERO */
        .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid var(--rule); margin-bottom: 3rem; align-items: center; }
        .hero-img { aspect-ratio: 4/3; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: rgba(255,255,255,.25); }
        .cat-tag { font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .25em; text-transform: uppercase; color: var(--sienna); display: inline-block; border-bottom: 1px solid var(--gold); padding-bottom: 2px; margin-bottom: .9rem; }
        .hero-content h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem,2.8vw,2.3rem); font-weight: 700; line-height: 1.2; margin-bottom: .9rem; }
        .post-meta { font-family: 'Josefin Sans', sans-serif; font-size: .63rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.1rem; }
        .excerpt { font-size: .96rem; line-height: 1.8; color: #4a3c2c; margin-bottom: 1.3rem; }
        .read-more { font-family: 'Josefin Sans', sans-serif; font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; color: var(--brown); background: none; border: none; border-bottom: 1px solid var(--gold); padding-bottom: 2px; cursor: pointer; transition: color .2s; }
        .read-more:hover { color: var(--gold); }

        /* SECTION */
        .sec-label { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .sec-label::before, .sec-label::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
        .sec-label span { font-family: 'Josefin Sans', sans-serif; font-size: .63rem; letter-spacing: .28em; text-transform: uppercase; color: var(--sienna); white-space: nowrap; }

        /* GRID */
        .post-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-bottom: 3rem; }
        .post-card { background: var(--card-bg); border: 1px solid var(--rule); cursor: pointer; position: relative; overflow: hidden; transition: box-shadow .25s, transform .25s; }
        .post-card:hover { box-shadow: 0 8px 30px rgba(92,61,30,.14); transform: translateY(-3px); }
        .top-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--sienna), var(--gold)); opacity: 0; transition: opacity .25s; }
        .post-card:hover .top-bar { opacity: 1; }
        .card-thumb { aspect-ratio: 16/9; }
        .card-body { padding: 1.2rem; }
        .card-body h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; line-height: 1.35; margin: .4rem 0 .45rem; }
        .card-exc { font-size: .84rem; line-height: 1.7; color: #5a4a38; margin-bottom: .7rem; }
        .empty-state { grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--muted); font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.05rem; }

        /* BOTTOM */
        .bottom-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; border-top: 1px solid var(--rule); padding-top: 3rem; }
        .widget-title { font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .28em; text-transform: uppercase; color: var(--sienna); border-bottom: 1px solid var(--rule); padding-bottom: .45rem; margin-bottom: 1.1rem; }
        .about-text { font-size: .88rem; line-height: 1.75; color: #4a3c2c; font-style: italic; }
        .tag-list { display: flex; flex-wrap: wrap; gap: .45rem; }
        .tag { font-family: 'Josefin Sans', sans-serif; font-size: .6rem; letter-spacing: .15em; text-transform: uppercase; padding: .28rem .7rem; border: 1px solid var(--rule); color: var(--brown); cursor: pointer; transition: all .2s; }
        .tag:hover { background: var(--brown); color: var(--cream); }
        .recent-list { list-style: none; display: flex; flex-direction: column; gap: .85rem; }
        .recent-list li { border-bottom: 1px solid var(--rule); padding-bottom: .85rem; cursor: pointer; }
        .recent-title { font-family: 'Playfair Display', serif; font-size: .9rem; display: block; margin-bottom: .18rem; }
        .recent-date { font-family: 'Josefin Sans', sans-serif; font-size: .6rem; letter-spacing: .1em; color: var(--muted); }
        .stats { display: flex; flex-direction: column; gap: .4rem; }
        .stat-row { display: flex; justify-content: space-between; border-bottom: 1px dotted var(--rule); padding-bottom: .4rem; font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
        .stat-row strong { font-family: 'Playfair Display', serif; font-weight: 700; color: var(--brown); font-size: .9rem; }

        /* FOOTER */
        footer { border-top: 3px double var(--rule); padding: 1.8rem 2rem; text-align: center; margin-top: 2rem; }
        .footer-brand { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: var(--brown); margin-bottom: .35rem; }

        /* MODAL */
        .overlay { position: fixed; inset: 0; background: rgba(26,18,9,.6); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal { background: var(--warm-white); max-width: 660px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 2.8rem; position: relative; border-top: 4px solid var(--gold); }
        .modal-close { position: absolute; top: 1rem; right: 1.2rem; background: none; border: none; font-size: 1.3rem; color: var(--muted); cursor: pointer; }
        .modal-cat { font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .25em; text-transform: uppercase; color: var(--sienna); display: block; margin-bottom: .7rem; }
        .modal-h2 { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 700; margin-bottom: .7rem; line-height: 1.2; }
        .modal-meta { font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.8rem; padding-bottom: 1.4rem; border-bottom: 1px solid var(--rule); }
        .modal-body p { font-size: 1rem; line-height: 1.9; color: #3a2c1e; margin-bottom: 1rem; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; }
          .post-grid { grid-template-columns: 1fr 1fr; }
          .bottom-cols { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .post-grid { grid-template-columns: 1fr; }
          .nav { gap: 1.5rem; flex-wrap: wrap; }
        }
      `}</style>
    </>
  )
}

// Fetch posts from Supabase at request time (SSR)
export async function getServerSideProps() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error('Supabase error:', error)

  return {
    props: {
      posts: posts ?? [],
    },
  }
}
