import { useState, useRef, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const CATS = ['Short Story', 'Flash Fiction', 'Essay', 'Poetry', 'Personal']
const MAX_IMAGES = 10
const MAX_SIZE_MB = 2

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_W = 1200
        let w = img.width, h = img.height
        if (w > MAX_W) { h = (h * MAX_W) / w; w = MAX_W }
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/webp', 0.8))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function Write() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', category: 'Short Story', excerpt: '', body: '' })
  const [images, setImages] = useState([]) // { id, dataUrl, caption }
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)
  const textRef = useRef(null)
  const wordCount = form.body.split(/\s+/).filter(Boolean).length

  const addImages = useCallback(async (files) => {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (newFiles.length === 0) return
    if (images.length + newFiles.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`)
      return
    }
    setError('')
    const processed = []
    for (const file of newFiles) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`"${file.name}" exceeds ${MAX_SIZE_MB}MB limit, skipping.`)
        continue
      }
      const dataUrl = await compressImage(file)
      processed.push({ id: Date.now() + Math.random(), dataUrl, caption: '' })
    }
    setImages(prev => [...prev, ...processed])
  }, [images.length])

  // Paste handler
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items
    if (!items) return
    const imageFiles = []
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        imageFiles.push(item.getAsFile())
      }
    }
    if (imageFiles.length > 0) addImages(imageFiles)
  }, [addImages])

  // Drop handler
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    addImages(e.dataTransfer.files)
  }, [addImages])

  const removeImage = (id) => setImages(prev => prev.filter(img => img.id !== id))
  const updateCaption = (id, caption) => setImages(prev => prev.map(img => img.id === id ? { ...img, caption } : img))

  async function handlePublish() {
    if (!form.title.trim() || !form.body.trim()) { setError('Please add at least a title and story body.'); return }
    if (!supabase) { setError('Supabase not configured. Check your .env.local file.'); return }
    setError(''); setSaving(true)

    // Save images as text-only references (no base64 in DB to avoid size limits)
    let fullBody = form.body.trim()
    if (images.length > 0) {
      fullBody += '\n\n---IMAGES---\n'
      images.forEach((img, i) => {
        fullBody += `\n[IMG_${i}]${img.dataUrl}[/IMG]\n`
        if (img.caption) fullBody += `[CAPTION]${img.caption}[/CAPTION]\n`
      })
    }

    try {
      const { error: dbError } = await supabase.from('posts').insert({
        title: form.title.trim(), category: form.category,
        excerpt: form.excerpt.trim() || form.body.trim().slice(0, 90) + '…',
        body: fullBody, thumb: Math.floor(Math.random() * 6),
      })
      if (dbError) {
        console.error('Supabase insert error:', dbError)
        setError(`Save failed: ${dbError.message || dbError.code || 'Unknown error'}`)
        setSaving(false)
        return
      }
      router.push('/?published=1')
    } catch (err) {
      console.error('Publish exception:', err)
      setError(`Network error: ${err.message}`)
      setSaving(false)
    }
  }

  return (
    <>
      <Head><title>Write · Bunnyish</title></Head>
      <div className="root" onPaste={handlePaste}>
        <header className="hdr">
          <div className="hdr-inner">
            <Link href="/" className="brand-link"><span>🐰</span><h1 className="brand">Bunnyish</h1></Link>
            <nav className="nav">
              <Link href="/" className="nl">Home</Link>
              <Link href="/write" className="nl active">Write</Link>
              <Link href="/admin" className="nl">Admin</Link>
            </nav>
          </div>
        </header>

        <main className="main">
          <div className="editor">
            <h2 className="title">✏️ Write a New Story</h2>
            <div className="form">
              <div className="row">
                <div className="fg">
                  <label>Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Your story title…" />
                </div>
                <div className="fg">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="fg">
                <label>Excerpt <span className="opt">(teaser shown on cards)</span></label>
                <input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="One enticing sentence…" />
              </div>

              <div className="fg">
                <label>Your Story *</label>
                <textarea
                  ref={textRef}
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Begin your story here… (you can paste images with Ctrl+V!)"
                  rows={16}
                />
                <span className="wc">{wordCount} words · ~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
              </div>

              {/* ── IMAGE UPLOAD AREA ── */}
              <div className="img-section">
                <label className="img-label">📷 Images</label>
                <div
                  className={`drop-zone ${dragOver ? 'drag-active' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => { addImages(e.target.files); e.target.value = '' }}
                  />
                  <div className="drop-content">
                    <span className="drop-icon">🖼️</span>
                    <p className="drop-text">Drop images here, click to browse, or <strong>paste (Ctrl+V)</strong></p>
                    <p className="drop-hint">Max {MAX_SIZE_MB}MB per image · up to {MAX_IMAGES} images · JPG, PNG, GIF, WebP</p>
                  </div>
                </div>

                {/* Image preview grid */}
                {images.length > 0 && (
                  <div className="img-grid">
                    {images.map((img, i) => (
                      <div key={img.id} className="img-card">
                        <div className="img-preview-wrap">
                          <img src={img.dataUrl} alt={`Upload ${i + 1}`} className="img-preview" />
                          <button className="img-remove" onClick={() => removeImage(img.id)} title="Remove">✕</button>
                          <span className="img-num">{i + 1}</span>
                        </div>
                        <input
                          className="img-caption"
                          value={img.caption}
                          onChange={e => updateCaption(img.id, e.target.value)}
                          placeholder="Add a caption…"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="err">{error}</p>}

              <div className="actions">
                <button className="pub" onClick={handlePublish} disabled={saving}>
                  {saving ? 'Publishing…' : `Publish Story${images.length > 0 ? ` (${images.length} image${images.length > 1 ? 's' : ''})` : ''} →`}
                </button>
                <Link href="/" className="cancel">Cancel</Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="ft"><span>🐰 Bunnyish</span></footer>
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

        .main { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
        .editor { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-card); }
        .title { font-family: 'Comfortaa', cursive; font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; }
        .form { display: flex; flex-direction: column; gap: 1rem; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .fg { display: flex; flex-direction: column; gap: 0.25rem; }
        .fg label { font-family: 'Quicksand', sans-serif; font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-muted); }
        .opt { text-transform: none; letter-spacing: 0; }
        .fg input, .fg select, .fg textarea { font-size: 0.88rem; padding: 0.65rem 0.8rem; border: 1px solid var(--border); background: var(--bg-elevated); color: var(--text-primary); border-radius: var(--radius); outline: none; transition: var(--transition); resize: vertical; }
        .fg input:focus, .fg select:focus, .fg textarea:focus { border-color: var(--yellow); box-shadow: 0 0 0 3px var(--yellow-glow); }
        .wc { font-family: 'Quicksand', sans-serif; font-size: 0.55rem; color: var(--text-muted); text-align: right; letter-spacing: 0.06em; }

        /* IMAGE SECTION */
        .img-section { display: flex; flex-direction: column; gap: 0.6rem; }
        .img-label { font-family: 'Quicksand', sans-serif; font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-muted); }

        .drop-zone {
          border: 2px dashed var(--border-accent);
          border-radius: var(--radius);
          padding: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
          background: var(--bg-elevated);
          text-align: center;
        }
        .drop-zone:hover, .drop-zone.drag-active {
          border-color: var(--yellow);
          background: var(--yellow-glow);
        }
        .drop-content { pointer-events: none; }
        .drop-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
        .drop-text { font-family: 'Nunito', sans-serif; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.3rem; }
        .drop-text strong { color: var(--text-accent); }
        .drop-hint { font-family: 'Quicksand', sans-serif; font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.04em; }

        .img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.8rem; margin-top: 0.3rem; }
        .img-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: var(--transition); }
        .img-card:hover { box-shadow: var(--shadow-hover); }
        .img-preview-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
        .img-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
        .img-remove {
          position: absolute; top: 4px; right: 4px;
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(0,0,0,0.6); color: #fff; border: none;
          font-size: 0.65rem; cursor: pointer; display: grid; place-items: center;
          transition: var(--transition); opacity: 0;
        }
        .img-card:hover .img-remove { opacity: 1; }
        .img-remove:hover { background: #d45; }
        .img-num {
          position: absolute; bottom: 4px; left: 4px;
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--yellow); color: #3a2a14;
          font-family: 'Quicksand', sans-serif; font-size: 0.55rem; font-weight: 700;
          display: grid; place-items: center;
        }
        .img-caption {
          width: 100%; border: none; border-top: 1px solid var(--border);
          padding: 0.4rem 0.5rem; font-size: 0.72rem;
          background: transparent; color: var(--text-primary); outline: none;
          font-family: 'Nunito', sans-serif;
        }
        .img-caption::placeholder { color: var(--text-muted); }

        .err { font-size: 0.7rem; color: #d45; }
        .actions { display: flex; gap: 0.8rem; align-items: center; margin-top: 0.3rem; }
        .pub { font-family: 'Quicksand', sans-serif; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; background: var(--gradient-brand); color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; transition: var(--transition); }
        .pub:hover { opacity: 0.9; transform: translateY(-1px); }
        .pub:disabled { opacity: 0.5; }
        .cancel { font-family: 'Quicksand', sans-serif; font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); border: 1px solid var(--border); padding: 0.75rem 1.2rem; border-radius: 10px; transition: var(--transition); }
        .cancel:hover { border-color: var(--yellow); color: var(--text-accent); }
        .ft { border-top: 1px solid var(--border); padding: 1rem; text-align: center; font-family: 'Comfortaa', cursive; font-weight: 700; font-size: 0.9rem; margin-top: 2rem; }

        @media (max-width: 550px) {
          .row { grid-template-columns: 1fr; }
          .hdr-inner { height: auto; padding: 0.6rem 0; flex-direction: column; gap: 0.4rem; }
          .img-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
        }
      `}</style>
    </>
  )
}
