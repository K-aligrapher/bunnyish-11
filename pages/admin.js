import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Admin({ posts: initialPosts }) {
  const [posts, setPosts] = useState(initialPosts)
  const [msg, setMsg] = useState('')

  async function handleDelete(id) {
    if (!window.confirm('Delete this story permanently?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) { setMsg('Delete failed.'); return }
    setPosts(posts.filter(p => p.id !== id))
    setMsg('Story deleted.')
    setTimeout(() => setMsg(''), 3000)
  }

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
