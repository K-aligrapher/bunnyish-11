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
      <Head><title>Admin · The Story Press</title></Head>
      <div className="root">
        <header className="hdr">
          <div className="masthead">
            <h1><Link href="/">The Story Press</Link></h1>
          </div>
          <nav className="nav">
            <Link href="/">All Stories</Link>
            <Link href="/write">Write New</Link>
            <Link href="/admin" className="active">Admin</Link>
          </nav>
        </header>

        <main className="main">
          <h2 className="page-title">Manage Stories</h2>
          {msg && <div className="msg">{msg}</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td className="title-cell">{p.title}</td>
                  <td><span className="cat-badge">{p.category}</span></td>
                  <td className="date-cell">{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    <button className="del-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={4} className="empty">No stories yet.</td></tr>
              )}
            </tbody>
          </table>
        </main>
      </div>

      <style jsx>{`
        .root { background: var(--cream); min-height: 100vh; }
        .hdr { background: var(--warm-white); border-bottom: 3px double var(--rule); padding: 0 2rem; }
        .masthead { text-align: center; padding: 1.4rem 0 1rem; }
        .masthead h1 { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; }
        .masthead h1 a { color: inherit; }
        .nav { display: flex; justify-content: center; gap: 2.5rem; padding: .75rem 0 .65rem; border-top: 1px solid var(--rule); }
        .nav a { font-family: 'Josefin Sans', sans-serif; font-size: .7rem; letter-spacing: .18em; text-transform: uppercase; color: var(--brown); }
        .nav a:hover, .nav a.active { color: var(--gold); }
        .main { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }
        .page-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; margin-bottom: 1.5rem; }
        .msg { font-family: 'Josefin Sans', sans-serif; font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; background: var(--warm-white); border-left: 3px solid var(--gold); padding: .7rem 1rem; margin-bottom: 1.5rem; color: var(--brown); }
        .table { width: 100%; border-collapse: collapse; }
        .table th { font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); text-align: left; padding: .6rem 1rem; border-bottom: 2px solid var(--rule); }
        .table td { padding: .85rem 1rem; border-bottom: 1px solid var(--rule); vertical-align: middle; }
        .title-cell { font-family: 'Playfair Display', serif; font-size: .95rem; color: var(--ink); }
        .date-cell { font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .08em; color: var(--muted); white-space: nowrap; }
        .cat-badge { font-family: 'Josefin Sans', sans-serif; font-size: .58rem; letter-spacing: .15em; text-transform: uppercase; padding: .22rem .6rem; border: 1px solid var(--rule); color: var(--sienna); }
        .del-btn { font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .12em; text-transform: uppercase; background: none; border: 1px solid #e0c8b8; color: var(--sienna); padding: .3rem .8rem; cursor: pointer; transition: all .2s; }
        .del-btn:hover { background: var(--sienna); color: var(--cream); border-color: var(--sienna); }
        .empty { text-align: center; color: var(--muted); font-style: italic; padding: 2rem; }
      `}</style>
    </>
  )
}

export async function getServerSideProps() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, category, created_at')
    .order('created_at', { ascending: false })
  return { props: { posts: posts ?? [] } }
}
