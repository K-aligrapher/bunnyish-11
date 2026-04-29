import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const CATS = ['Short Story', 'Flash Fiction', 'Essay', 'Poetry', 'Personal']

export default function Write() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', category: 'Short Story', excerpt: '', body: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const wordCount = form.body.split(/\s+/).filter(Boolean).length

  async function handlePublish() {
    if (!form.title.trim() || !form.body.trim()) {
      setError('Please add at least a title and story body.')
      return
    }
    setError('')
    setSaving(true)

    const { error: dbError } = await supabase.from('posts').insert({
      title: form.title.trim(),
      category: form.category,
      excerpt: form.excerpt.trim() || form.body.trim().slice(0, 90) + '…',
      body: form.body.trim(),
      thumb: Math.floor(Math.random() * 6),
    })

    if (dbError) {
      setError('Failed to save. Please try again.')
      setSaving(false)
      return
    }

    router.push('/?published=1')
  }

  return (
    <>
      <Head>
        <title>Write New Story · The Story Press</title>
      </Head>

      <div className="root">
        {/* HEADER */}
        <header className="hdr">
          <div className="masthead">
            <h1><Link href="/">The Story Press</Link></h1>
            <p className="sub">A personal journal of words &amp; worlds</p>
          </div>
          <nav className="nav">
            <Link href="/">All Stories</Link>
            <Link href="/write" className="active">Write New</Link>
          </nav>
        </header>

        <main className="main">
          <div className="editor-wrap">
            <h2 className="editor-title">Write a New Story</h2>

            <div className="form">
              <div className="form-row">
                <div className="fg">
                  <label>Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Your story title…"
                  />
                </div>
                <div className="fg">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="fg">
                <label>Excerpt <span className="opt">(teaser line shown on cards)</span></label>
                <input
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="One enticing sentence…"
                />
              </div>

              <div className="fg">
                <label>Your Story *</label>
                <textarea
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Begin your story here…"
                  rows={16}
                />
                <span className="word-count">{wordCount} words · ~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
              </div>

              {error && <p className="error">{error}</p>}

              <div className="actions">
                <button className="btn-publish" onClick={handlePublish} disabled={saving}>
                  {saving ? 'Publishing…' : 'Publish Story →'}
                </button>
                <Link href="/" className="btn-cancel">Cancel</Link>
              </div>
            </div>
          </div>
        </main>

        <footer>
          <div className="footer-brand">The Story Press</div>
        </footer>
      </div>

      <style jsx>{`
        .root { background: var(--cream); min-height: 100vh; }
        .hdr { background: var(--warm-white); border-bottom: 3px double var(--rule); padding: 0 2rem; }
        .masthead { text-align: center; padding: 1.6rem 0 1.1rem; }
        .masthead h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem,5vw,3.5rem); font-weight: 900; letter-spacing: -.02em; }
        .masthead h1 a { color: inherit; }
        .sub { font-family: 'Josefin Sans', sans-serif; font-size: .66rem; letter-spacing: .32em; text-transform: uppercase; color: var(--sienna); margin-top: .4rem; }
        .nav { display: flex; justify-content: center; gap: 2.5rem; padding: .75rem 0 .65rem; border-top: 1px solid var(--rule); }
        .nav a { font-family: 'Josefin Sans', sans-serif; font-size: .7rem; letter-spacing: .18em; text-transform: uppercase; color: var(--brown); transition: color .2s; }
        .nav a:hover, .nav a.active { color: var(--gold); }

        .main { max-width: 1140px; margin: 0 auto; padding: 3rem 2rem; }
        .editor-wrap { max-width: 740px; }
        .editor-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; margin-bottom: 2rem; color: var(--ink); }

        .form { display: flex; flex-direction: column; gap: 1.2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
        .fg { display: flex; flex-direction: column; gap: .3rem; }
        .fg label { font-family: 'Josefin Sans', sans-serif; font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); }
        .opt { text-transform: none; letter-spacing: 0; font-size: .65rem; color: #b0a090; }
        .fg input, .fg select, .fg textarea {
          font-family: 'Lora', serif; font-size: .92rem; padding: .65rem .85rem;
          border: 1px solid var(--rule); background: var(--warm-white); color: var(--ink);
          border-radius: 1px; outline: none; transition: border-color .2s; resize: vertical;
        }
        .fg input:focus, .fg select:focus, .fg textarea:focus { border-color: var(--gold); }
        .word-count { font-family: 'Josefin Sans', sans-serif; font-size: .6rem; color: var(--muted); text-align: right; margin-top: -.5rem; letter-spacing: .08em; }

        .error { font-family: 'Josefin Sans', sans-serif; font-size: .68rem; color: var(--sienna); letter-spacing: .05em; }

        .actions { display: flex; gap: 1rem; align-items: center; margin-top: .5rem; }
        .btn-publish {
          font-family: 'Josefin Sans', sans-serif; font-size: .7rem; letter-spacing: .25em;
          text-transform: uppercase; background: var(--brown); color: var(--cream);
          border: none; padding: .9rem 1.8rem; cursor: pointer; transition: background .2s;
        }
        .btn-publish:hover { background: var(--sienna); }
        .btn-publish:disabled { opacity: .55; cursor: default; }
        .btn-cancel {
          font-family: 'Josefin Sans', sans-serif; font-size: .7rem; letter-spacing: .2em;
          text-transform: uppercase; background: transparent; color: var(--muted);
          border: 1px solid var(--rule); padding: .9rem 1.4rem; transition: all .2s;
        }
        .btn-cancel:hover { border-color: var(--brown); color: var(--brown); }

        footer { border-top: 3px double var(--rule); padding: 1.8rem 2rem; text-align: center; margin-top: 3rem; }
        .footer-brand { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: var(--brown); }

        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
