import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''

const pwStyles = `
  .pw-page { min-height: 100vh; background: var(--bg-deep); display: grid; place-items: center; padding: 1.5rem; }
  .pw-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2.5rem; text-align: center; max-width: 360px; width: 100%; box-shadow: var(--shadow-card); }
  .pw-bunny { font-size: 3rem; margin-bottom: 0.5rem; animation: bounce 2s ease-in-out infinite; }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .pw-title { font-family: 'Comfortaa', cursive; font-size: 1.6rem; font-weight: 700; background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.3rem; }
  .pw-sub { font-family: 'Quicksand', sans-serif; font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.1em; margin-bottom: 1.5rem; }
  .pw-form { display: flex; flex-direction: column; gap: 0.7rem; }
  .pw-input { font-size: 0.9rem; padding: 0.7rem 1rem; text-align: center; border: 1px solid var(--border); background: var(--bg-elevated); color: var(--text-primary); border-radius: var(--radius); outline: none; transition: var(--transition); font-family: inherit; }
  .pw-input:focus { border-color: var(--yellow); box-shadow: 0 0 0 3px var(--yellow-glow); }
  .pw-btn { font-family: 'Quicksand', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; background: var(--gradient-brand); color: #fff; border: none; padding: 0.7rem; border-radius: var(--radius); cursor: pointer; transition: var(--transition); }
  .pw-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .pw-err { font-family: 'Quicksand', sans-serif; font-size: 0.7rem; color: #d45; margin-top: 0.5rem; }
  .pw-back { display: inline-block; margin-top: 1.2rem; font-family: 'Quicksand', sans-serif; font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.08em; transition: var(--transition); }
  .pw-back:hover { color: var(--text-accent); }
`

export default function Admin({ posts: initialPosts }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [posts, setPosts] = useState(initialPosts)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('bunnyish-auth') === 'true') {
      setAuthed(true)
    }
  }, [])

  function handleLogin(e) {
    e.preventDefault()
    if (pw === ADMIN_PW) {
      sessionStorage.setItem('bunnyish-auth', 'true')
      setAuthed(true); setPwError('')
    } else {
      setPwError('Wrong password! 🐰')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this story permanently?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) { setMsg('Delete failed.'); return }
    setPosts(posts.filter(p => p.id !== id))
    setMsg('Story deleted.')
    setTimeout(() => setMsg(''), 3000)
  }

  // ── PASSWORD GATE ──
  if (!authed) {
    return (
      <>
        <Head><title>Login · Bunnyish</title></Head>
        <div className="pw-page">
          <div className="pw-card">
            <div className="pw-bunny">🐰</div>
            <h2 className="pw-title">Bunnyish</h2>
            <p className="pw-sub">Enter password for admin</p>
            <form onSubmit={handleLogin} className="pw-form">
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Password…" className="pw-input" autoFocus />
              <button type="submit" className="pw-btn">Enter →</button>
            </form>
            {pwError && <p className="pw-err">{pwError}</p>}
            <Link href="/" className="pw-back">← Back to Home</Link>
          </div>
        </div>
        <style jsx>{pwStyles}</style>
      </>
    )
  }

  // ── ADMIN PAGE ──
  return (
    <>
      <Head><title>Admin · Bunnyish</title></Head>
      <div className="root">
        <header className="hdr">
          <div className="hdr-inner">
            <Link href="/" className="brand-link"><span>🐰</span><h1 className="brand">Bunnyish</h1></Link>
            <nav className="nav">
              <Link href="/" className="nl">Home</Link>
              <Link href="/write" className="nl">Write</Link>
              <Link href="/admin" className="nl active">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="main">
          <h2 className="title">🛠️ Manage Stories</h2>
          {msg && <div className="msg">{msg}</div>}
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id}>
                    <td className="tc">{p.title}</td>
                    <td><span className="badge">{p.category}</span></td>
                    <td className="dc">{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><button className="del" onClick={() => handleDelete(p.id)}>Delete</button></td>
                  </tr>
                ))}
                {posts.length === 0 && <tr><td colSpan={4} className="empty">No stories yet 🐇</td></tr>}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <style jsx>{`
        .root { min-height: 100vh; background: var(--bg-deep); }
        .hdr { position: sticky; top: 0; z-index: 50; background: var(--header-bg); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); padding: 0 1.5rem; }
        .hdr-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; height: 56px; }
        .brand-link { display: flex; align-items: center; gap: 0.4rem; }
        .brand { font-family: 'Comfortaa', cursive; font-size: 1.4rem; font-weight: 700; background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .nav { display: flex; gap: 0.25rem; }
        .nl { font-family: 'Quicksand', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); padding: 0.4rem 0.9rem; border-radius: 10px; transition: var(--transition); }
        .nl:hover { color: var(--text-primary); background: var(--bg-hover); }
        .nl.active { color: var(--text-accent); background: var(--yellow-glow); }
        .main { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }
        .title { font-family: 'Comfortaa', cursive; font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; }
        .msg { font-family: 'Quicksand', sans-serif; font-size: 0.7rem; letter-spacing: 0.08em; background: var(--bg-card); border-left: 3px solid var(--yellow); padding: 0.6rem 1rem; margin-bottom: 1.2rem; border-radius: 0 10px 10px 0; color: var(--text-accent); }
        .table-wrap { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-card); }
        .table { width: 100%; border-collapse: collapse; }
        .table th { font-family: 'Quicksand', sans-serif; font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-muted); text-align: left; padding: 0.7rem 1rem; border-bottom: 1px solid var(--border); background: var(--bg-elevated); }
        .table td { padding: 0.8rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .table tr:hover td { background: var(--bg-hover); }
        .tc { font-family: 'Comfortaa', cursive; font-size: 0.85rem; }
        .dc { font-family: 'Quicksand', sans-serif; font-size: 0.58rem; letter-spacing: 0.06em; color: var(--text-muted); white-space: nowrap; }
        .badge { font-family: 'Quicksand', sans-serif; font-size: 0.52rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.18rem 0.5rem; border: 1px solid var(--border-accent); border-radius: 20px; color: var(--text-accent); }
        .del { font-family: 'Quicksand', sans-serif; font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; background: none; border: 1px solid var(--border-accent); color: var(--orange); padding: 0.28rem 0.7rem; border-radius: 8px; cursor: pointer; transition: var(--transition); }
        .del:hover { background: rgba(232,152,90,0.12); }
        .empty { text-align: center; color: var(--text-muted); font-style: italic; padding: 2rem; }
        @media (max-width: 550px) { .hdr-inner { height: auto; padding: 0.6rem 0; flex-direction: column; gap: 0.4rem; } }
      `}</style>
    </>
  )
}

export async function getServerSideProps() {
  if (!supabase) return { props: { posts: [] } }
  try {
    const { data: posts } = await supabase.from('posts').select('id, title, category, created_at').order('created_at', { ascending: false })
    return { props: { posts: posts ?? [] } }
  } catch {
    return { props: { posts: [] } }
  }
}
