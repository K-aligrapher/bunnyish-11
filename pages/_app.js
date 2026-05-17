import { useState, useEffect, createContext, useContext } from 'react'
import '../styles/globals.css'

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })
export const useTheme = () => useContext(ThemeContext)

/* ─────────────────────────────────────────
   BUNNY ECG LOADER
   Clean ECG line with two rabbit ears as peaks
   Left ear is straight, right ear is bent/floppy
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

        {/* ECG + Rabbit Ears SVG */}
        <div className="ecg-wrap">
          <svg viewBox="0 0 1000 250" fill="none" className="ecg-svg" preserveAspectRatio="xMidYMid meet">
            <path
              d={`
                M 0 160
                L 80 160
                L 95 155
                L 105 168
                L 115 150
                L 130 160
                L 200 160
                L 220 155
                L 230 170
                L 240 148
                L 255 160
                L 330 160
                L 345 158
                L 355 160

                C 380 160 390 158 400 150
                C 410 138 415 80 420 45
                C 425 20 430 10 435 15
                C 440 22 443 50 446 80
                C 450 115 453 145 458 155
                C 460 158 462 160 465 160

                L 490 160

                C 495 160 498 158 500 152
                C 505 140 510 100 515 65
                C 520 35 525 20 530 25
                C 534 30 536 55 540 80
                Q 548 120 555 135
                C 558 142 562 155 570 160
                Q 578 168 585 170
                Q 592 172 598 165
                C 602 160 605 160 610 160

                L 660 160
                L 675 155
                L 685 168
                L 695 148
                L 710 160
                L 780 160
                L 795 158
                L 805 163
                L 815 155
                L 830 160
                L 920 160
                L 935 157
                L 945 160
                L 1000 160
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
          stroke-dasharray: 2400;
          stroke-dashoffset: 2400;
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
