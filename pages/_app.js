import { useState, useEffect, createContext, useContext } from 'react'
import '../styles/globals.css'

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })
export const useTheme = () => useContext(ThemeContext)

/* ─────────────────────────────────────────
   BUNNY ECG LOADER
   Continuous line: ECG beats → round ear → bent ear → ECG beats
   ───────────────────────────────────────── */
function BunnyLoader({ theme }) {
  const [fadeOut, setFadeOut] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 3600)
    return () => clearTimeout(timer)
  }, [])

  const isDark = theme === 'dark'
  const bg = isDark
    ? 'linear-gradient(180deg, #1a1610, #221e16)'
    : 'linear-gradient(180deg, #fef6e0, #fff3d6)'
  const lineColor = isDark ? '#f5c542' : '#3a2a14'
  const taglineColor = isDark ? '#7a6c58' : '#a0907a'

  return (
    <div className={`loader ${fadeOut ? 'out' : ''}`} style={{ background: bg }}>
      <div className="loader-content">
        <h1 className="loader-title">Bunnyish</h1>
        <p className="loader-sub" style={{ color: taglineColor }}>stories · poems · blog</p>

        <div className="ecg-wrap">
          <svg viewBox="0 0 1000 300" fill="none" className="ecg-svg" preserveAspectRatio="xMidYMid meet">
            <path
              d={`
                M 0 210
                L 70 210
                L 85 205  L 95 218  L 105 200  L 115 210
                L 170 210
                L 185 205  L 195 215  L 205 202  L 215 210
                L 280 210

                C 290 210, 310 208, 320 200
                C 335 188, 345 140, 355 95
                C 362 62, 368 35, 375 25
                C 382 15, 388 18, 392 30
                C 398 50, 402 85, 407 120
                C 413 158, 418 185, 425 198
                C 430 206, 435 210, 445 210

                L 465 210

                C 470 208, 475 205, 478 198
                C 484 182, 490 130, 498 80
                C 504 45, 510 22, 516 18
                C 520 15, 524 20, 528 32
                C 534 52, 538 78, 542 105
                C 548 140, 555 165, 562 178
                C 568 188, 575 198, 585 208
                C 592 215, 600 222, 610 228
                C 620 234, 630 232, 638 225
                C 645 218, 648 212, 650 210

                L 690 210
                L 705 205  L 715 218  L 725 200  L 738 210
                L 790 210
                L 805 207  L 815 213  L 825 205  L 835 210
                L 900 210
                L 915 208  L 925 210
                L 1000 210
              `}
              stroke={lineColor}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ecg-path"
            />
          </svg>
        </div>

        <div className="dots">
          <span className="d" /><span className="d" /><span className="d" />
        </div>
      </div>

      <style jsx>{`
        .loader {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.7s ease, visibility 0.7s ease;
        }
        .loader.out { opacity: 0; visibility: hidden; pointer-events: none; }
        .loader-content { display: flex; flex-direction: column; align-items: center; width: 90%; max-width: 700px; }
        .loader-title {
          font-family: 'Comfortaa', cursive; font-weight: 700;
          font-size: clamp(2rem, 5vw, 3.2rem);
          background: linear-gradient(135deg, #f5c542, #e8985a);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 0.2rem; animation: fadeUp 0.6s ease 0.2s both;
        }
        .loader-sub {
          font-family: 'Quicksand', sans-serif; font-size: 0.72rem;
          letter-spacing: 0.3em; text-transform: uppercase;
          margin-bottom: 1.5rem; animation: fadeUp 0.6s ease 0.4s both;
        }
        .ecg-wrap { width: 100%; animation: fadeUp 0.8s ease 0.5s both; }
        .ecg-svg { width: 100%; height: auto; overflow: visible; }
        .ecg-path {
          stroke-dasharray: 2600;
          stroke-dashoffset: 2600;
          animation: draw 3s ease-in-out 0.6s forwards;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dots { display: flex; gap: 6px; margin-top: 1.5rem; animation: fadeUp 0.6s ease 1s both; }
        .d {
          width: 5px; height: 5px; border-radius: 50%;
          background: #f5c542; animation: pulse 1.4s ease-in-out infinite;
        }
        .d:nth-child(2) { animation-delay: 0.2s; background: #e8985a; }
        .d:nth-child(3) { animation-delay: 0.4s; background: #d4a327; }
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} className="tt" id="theme-toggle" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      {theme === 'dark' ? '☀️' : '🌙'}
      <style jsx>{`
        .tt {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 90;
          width: 46px; height: 46px; border-radius: 50%;
          background: var(--bg-card); border: 1px solid var(--border);
          cursor: pointer; font-size: 1.15rem; display: grid; place-items: center;
          box-shadow: var(--shadow-card); transition: var(--transition);
        }
        .tt:hover { transform: scale(1.12); box-shadow: var(--shadow-hover); }
      `}</style>
    </button>
  )
}

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('bunnyish-theme')
    if (saved) setTheme(saved)
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('bunnyish-theme', theme)
  }, [theme])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4200)
    return () => clearTimeout(t)
  }, [])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {loading && <BunnyLoader theme={theme} />}
      <Component {...pageProps} />
      <ThemeToggle />
    </ThemeContext.Provider>
  )
}
