import React, { useEffect, useRef, useState } from 'react'

const UNLOCK_KEY = 'dune-unlock-session'
const UNLOCKED_AT_KEY = 'dune-unlock-at'
const UNLOCK_TTL_MS = 60 * 60 * 1000

const CONFIG = {
  accessPassword: 'c3QTGoGvXgtTFWdpnrKj3msy0F9dmpyztGRLpKdfR3U9E1EXb5',
  songs: [
    { title: 'Magnets', artist: 'NIKI', file: '/magnets.mp3', cover: '/magnets.jpg' },
    { title: 'YK', artist: 'Cean Jr', file: '/yk.mp3', cover: '/yk.jpg' },
    { title: 'Get You', artist: 'Daniel Caesar ft. Kali Uchis', file: '/getyou.mp3', cover: '/getyou.jpeg' },
    { title: 'To the Bone', artist: 'Pamungkas', file: '/tothebone.mp3', cover: '/tothebone.png' },
    { title: 'Ruin the Friendship', artist: 'Taylor Swift', file: '/ruin.mp3', cover: '/ruin.png' },
    { title: 'Take a Chance with Me', artist: 'NIKI', file: '/take.mp3', cover: '/take.png' },
    { title: 'Go Baby', artist: 'Justin Bieber', file: '/gobaby.mp3', cover: '/swag.png' },
  ],
  memories: {
    photos: [
      { src: '/yunjin1.jpg' },
      { src: '/jungwon1.jpg' },
      { src: '/yunjin2.jpg' },
      { src: '/jungwon2.jpg' },
      { src: '/unme.jpg' },
    ],
    movies: [
      { title: 'Mulholland Drive', year: '2001', rating: 5, poster: '/mulhollanddr.jpg', review: 'confusing af but i had loads of fun analyzing this with you' },
      { title: 'Conclave', year: '2024', rating: 4, poster: '/conclave.jpeg', review: 'your obsession with old man yaoi is very endearing lol' },
      { title: 'Dune', year: '2021', rating: 4, poster: '/dune.webp', review: 'LISAN AL GAIB' },
      { title: 'Dune Part Two', year: '2024', rating: 5, poster: '/dunept2.jpg', review: 'best movie of all time' },
      { title: 'Before Sunrise', year: '1995', rating: 4.5, poster: '/beforesunrise.jpg', review: '1 day walktuationship. i loved every second i spent watching this with you' },
      { title: 'Two People Exchanging Saliva', year: '2024', rating: 4, poster: '/twoppl.jpg', review: 'i remember being sleepy as shit watching this. what an experience' },
      { title: 'Monster', year: '2023', rating: 4.5, poster: '/monster.jpg', review: 'thank you for introducing me to this movie. broke my heart into a million pieces but it was a beautiful experience nonetheless. it was heavy, yet uplifting. a lot transpired in the film but the one moment that really stuck with me was when you asked what color was on the screen'},
      { title: 'Manila in the Claws of Light', year: '1975', rating: 5, poster: '/manila.jpg', review: 'this was genuinely just heartbreaking. all 120 minutes of it' },
      { title: 'Atonement', year: '2007', rating: 4, poster: '/atonement.jpg', review: 'FUCK YOU BRIONY TALLIS' },
      { title: 'Mysterious Skin', year: '2004', rating: 5, poster: '/mysteriousskin.jpg', review: 'Incredibly moving and raw.' },
      { title: 'Scream V', year: '2022', rating: 2, poster: '/scream5.jpeg', review: 'stupid af movie. the only saving grace was mikey madison'},
      { title: 'Parasite', year: '2019', rating: 5, poster: '/parasite.jpg', review: 'sorry i made you watch this movie at 2 am baby lmfao' },
      { title: 'Possession', year: '1981', rating: 4.5, poster: '/possession.jpg', review: 'i love how we both went into this movie thinking it was gonna be about a demonic possession. i felt like i was going crazy with isabelle adjani' },
    ],
    valorantMaps: [
      '/ascent.jpeg',
      '/haven.webp',
      '/split.jpeg',
      '/lotus.jpeg',
      '/abyss.png',
    ],
  },
}

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function stars(rating) {
  const n = Math.max(0, Math.min(5, Number(rating) || 0))
  return Array.from({ length: 5 }, (_, i) => (i < Math.floor(n) ? 'full' : 'empty'))
}

function shuffle(text) {
  const arr = text.replace(/\s+/g, '').toUpperCase().split('')
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

function randomPattern(length) {
  return Array.from({ length }, () => 1 + Math.floor(Math.random() * 4))
}

const FloatingHearts = React.memo(function FloatingHearts() {
  const hearts = useRef(Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 10 + Math.random() * 15,
    size: 15 + Math.random() * 20,
  }))).current

  return (
    <div className="floating-hearts">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}px`,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  )
})

function CursorHearts() {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const id = Date.now() + Math.random()
      const newHeart = {
        id,
        x: e.clientX,
        y: e.clientY,
        size: 10 + Math.random() * 15,
        rotation: Math.random() * 360,
        tx: (Math.random() - 0.5) * 50,
        ty: -50 - Math.random() * 50,
      }
      setHearts((prev) => [...prev, newHeart].slice(-20))
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setHearts((prev) => prev.filter((h) => Date.now() - h.id < 1000))
    }, 100)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="cursor-hearts">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="cursor-heart"
          style={{
            left: h.x,
            top: h.y,
            fontSize: `${h.size}px`,
            '--tx': `${h.tx}px`,
            '--ty': `${h.ty}px`,
            '--rot': `${h.rotation}deg`,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  )
}

export default function App() {
  const [pass, setPass] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(() => {
    if (typeof window === 'undefined') return 'all'
    return window.sessionStorage.getItem('dune-current-page') || 'all'
  })
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false
    const unlocked = window.sessionStorage.getItem(UNLOCK_KEY) === 'true'
    const unlockedAt = Number(window.sessionStorage.getItem(UNLOCKED_AT_KEY) || 0)
    return unlocked && Date.now() - unlockedAt < UNLOCK_TTL_MS
  })

  const [secret, setSecret] = useState('')
  const [secretOk, setSecretOk] = useState(false)
  const [ask, setAsk] = useState('')
  const [noPos, setNoPos] = useState({ x: 130, y: 0 })
  const askRef = useRef(null)

  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef(null)
  const currentTrack = CONFIG.songs[trackIndex] || CONFIG.songs[0]

  const [activeGame, setActiveGame] = useState('puzzle')
  const [puzzleGrid, setPuzzleGrid] = useState([])
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [puzzleImage, setPuzzleImage] = useState(CONFIG.memories.valorantMaps[0])
  const [puzzleMoves, setPuzzleMoves] = useState(0)
  const [puzzleGameOver, setPuzzleGameOver] = useState(false)
  const PUZZLE_MAX_MOVES = 40

  const [reactionPhase, setReactionPhase] = useState('idle')
  const [reactionMsg, setReactionMsg] = useState('press start.')
  const [reactionBest, setReactionBest] = useState(null)
  const reactionStartRef = useRef(0)
  const reactionTimeoutRef = useRef(null)

  const [targets, setTargets] = useState([])
  const [shooterRunning, setShooterRunning] = useState(false)
  const [shooterScore, setShooterScore] = useState(0)
  const [shooterTime, setShooterTime] = useState(20)
  const shooterSpawnRef = useRef(null)
  const shooterTimerRef = useRef(null)

  const [seqPattern, setSeqPattern] = useState([])
  const [seqInput, setSeqInput] = useState([])
  const [seqShowing, setSeqShowing] = useState(false)
  const [seqLevel, setSeqLevel] = useState(1)
  const [seqStatus, setSeqStatus] = useState('press start.')
  const [seqActive, setSeqActive] = useState(null)
  const seqHideRef = useRef(null)

  useEffect(() => {
    window.sessionStorage.setItem('dune-current-page', page)
  }, [page])

  useEffect(() => {
    if (!isUnlocked) return
    const intervalId = window.setInterval(() => {
      const unlockedAt = Number(window.sessionStorage.getItem(UNLOCKED_AT_KEY) || 0)
      if (Date.now() - unlockedAt > UNLOCK_TTL_MS) {
        window.sessionStorage.removeItem(UNLOCK_KEY)
        window.sessionStorage.removeItem(UNLOCKED_AT_KEY)
        setIsUnlocked(false)
        setStatus('Session expired. Enter password again.')
      }
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [isUnlocked])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [trackIndex, isPlaying])

  useEffect(() => () => {
    if (reactionTimeoutRef.current) window.clearTimeout(reactionTimeoutRef.current)
    if (shooterSpawnRef.current) window.clearInterval(shooterSpawnRef.current)
    if (shooterTimerRef.current) window.clearInterval(shooterTimerRef.current)
    if (seqHideRef.current) window.clearTimeout(seqHideRef.current)
  }, [])

  function unlock() {
    if (normalize(pass) !== normalize(CONFIG.accessPassword)) {
      setStatus('Wrong password.')
      return
    }
    window.sessionStorage.setItem(UNLOCK_KEY, 'true')
    window.sessionStorage.setItem(UNLOCKED_AT_KEY, String(Date.now()))
    setIsUnlocked(true)
    setStatus('')
    setPass('')
  }

  function unlockSecret() {
    if (normalize(secret) === 'toothpaste') {
      setStatus('LFGGGGGGGGG')
      setTimeout(() => {
        setSecretOk(true)
        setStatus('')
      }, 800)
    } else {
      setStatus('Try again baby')
    }
  }

  function moveNo() {
    const zone = askRef.current
    if (!zone) return
    const rect = zone.getBoundingClientRect()
    setNoPos({ x: Math.random() * Math.max(rect.width - 62, 6), y: Math.random() * Math.max(rect.height - 30, 0) })
  }

  function pickTrack(index) {
    setTrackIndex(index)
    setIsPlaying(true)
    setShowPlaylist(false)
  }

  function nextTrack() {
    setTrackIndex((i) => (i + 1) % CONFIG.songs.length)
    setIsPlaying(true)
  }

  function prevTrack() {
    setTrackIndex((i) => (i - 1 + CONFIG.songs.length) % CONFIG.songs.length)
    setIsPlaying(true)
  }

  useEffect(() => {
    if (page === 'games' && activeGame === 'puzzle' && puzzleGrid.length === 0) {
      newPuzzle()
    }
  }, [page, activeGame])

  function newPuzzle() {
    const map = CONFIG.memories.valorantMaps[Math.floor(Math.random() * CONFIG.memories.valorantMaps.length)]
    setPuzzleImage(map)
    
    // Create 3x3 grid (0-8, where 8 is empty)
    let initial = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    
    // Shuffle with solvability check
    function isSolvable(arr) {
      let invCount = 0
      for (let i = 0; i < 9 - 1; i++) {
        for (let j = i + 1; j < 9; j++) {
          if (arr[i] !== 8 && arr[j] !== 8 && arr[i] > arr[j]) invCount++
        }
      }
      return invCount % 2 === 0
    }

    let shuffled
    do {
      shuffled = [...initial].sort(() => Math.random() - 0.5)
    } while (!isSolvable(shuffled) || JSON.stringify(shuffled) === JSON.stringify(initial))

    setPuzzleGrid(shuffled)
    setPuzzleSolved(false)
    setPuzzleMoves(0)
    setPuzzleGameOver(false)
  }

  function movePiece(index) {
    if (puzzleSolved || puzzleGameOver) return
    const emptyIndex = puzzleGrid.indexOf(8)
    const row = Math.floor(index / 3)
    const col = index % 3
    const emptyRow = Math.floor(emptyIndex / 3)
    const emptyCol = emptyIndex % 3

    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
                      (Math.abs(col - emptyCol) === 1 && row === emptyRow)

    if (isAdjacent) {
      const newMoves = puzzleMoves + 1
      setPuzzleMoves(newMoves)
      const newGrid = [...puzzleGrid]
      ;[newGrid[index], newGrid[emptyIndex]] = [newGrid[emptyIndex], newGrid[index]]
      setPuzzleGrid(newGrid)
      
      if (newGrid.every((val, i) => val === i)) {
        setPuzzleSolved(true)
      } else if (newMoves >= PUZZLE_MAX_MOVES) {
        setPuzzleGameOver(true)
      }
    }
  }

  function startReaction() {
    if (reactionTimeoutRef.current) window.clearTimeout(reactionTimeoutRef.current)
    setReactionPhase('waiting')
    setReactionMsg('Wait...')
    reactionTimeoutRef.current = window.setTimeout(() => {
      reactionStartRef.current = performance.now()
      setReactionPhase('go')
      setReactionMsg('TAP NOW!')
      reactionTimeoutRef.current = null
    }, 900 + Math.random() * 1300)
  }

  function tapReaction() {
    if (reactionPhase === 'waiting') {
      if (reactionTimeoutRef.current) window.clearTimeout(reactionTimeoutRef.current)
      setReactionPhase('idle')
      setReactionMsg('Too early.')
      return
    }
    if (reactionPhase !== 'go') return
    const ms = Math.round(performance.now() - reactionStartRef.current)
    setReactionMsg(`${ms} ms`)
    setReactionPhase('idle')
    setReactionBest((prev) => (prev == null || ms < prev ? ms : prev))
  }

  function startShooter() {
    if (shooterSpawnRef.current) window.clearInterval(shooterSpawnRef.current)
    if (shooterTimerRef.current) window.clearInterval(shooterTimerRef.current)
    setTargets([])
    setShooterScore(0)
    setShooterTime(20)
    setShooterRunning(true)

    shooterSpawnRef.current = window.setInterval(() => {
      const id = Date.now() + Math.random()
      setTargets((prev) => [...prev, { id, x: 10 + Math.random() * 80, y: 10 + Math.random() * 75 }].slice(-12))
    }, 550)

    shooterTimerRef.current = window.setInterval(() => {
      setShooterTime((t) => {
        const next = t - 1
        if (next <= 0) {
          if (shooterSpawnRef.current) window.clearInterval(shooterSpawnRef.current)
          if (shooterTimerRef.current) window.clearInterval(shooterTimerRef.current)
          setShooterRunning(false)
          return 0
        }
        return next
      })
    }, 1000)
  }

  function shoot(id) {
    if (!shooterRunning) return
    setTargets((prev) => prev.filter((t) => t.id !== id))
    setShooterScore((s) => s + 1)
  }

  function startSequence() {
    const pattern = randomPattern(seqLevel + 2)
    setSeqPattern(pattern)
    setSeqInput([])
    setSeqShowing(true)
    setSeqStatus('Memorize...')
    if (seqHideRef.current) window.clearTimeout(seqHideRef.current)

    // Flash pattern
    let i = 0
    const interval = setInterval(() => {
      setSeqActive(pattern[i])
      setTimeout(() => setSeqActive(null), 400)
      i++
      if (i >= pattern.length) {
        clearInterval(interval)
        setTimeout(() => {
          setSeqShowing(false)
          setSeqStatus('Repeat.')
        }, 600)
      }
    }, 800)
  }

  function pressSeq(n) {
    if (seqShowing || !seqPattern.length) return
    setSeqActive(n)
    setTimeout(() => setSeqActive(null), 200)

    const next = [...seqInput, n]
    const expected = seqPattern[next.length - 1]
    if (n !== expected) {
      setSeqStatus(`Wrong. Pattern: ${seqPattern.join(' ')}`)
      setSeqPattern([])
      setSeqInput([])
      return
    }
    if (next.length === seqPattern.length) {
      setSeqLevel((l) => l + 1)
      setSeqStatus('Nice! Next level.')
      setSeqPattern([])
      setSeqInput([])
      return
    }
    setSeqInput(next)
    setSeqStatus(`${next.length}/${seqPattern.length}`)
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function handleSeek(e) {
    const time = Number(e.target.value)
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  return (
    <div className="app">
      {!isUnlocked && (
        <section className="card">
          <p className="section-label">private page</p>
          <input value={pass} placeholder="enter password" onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && unlock()} />
          <button className="primary-btn" onClick={unlock}>open</button>
          <p className="status">{status}</p>
        </section>
      )}

      {isUnlocked && (
        <>
          <FloatingHearts />
          <CursorHearts />
          <main className="memory-layout">
            <nav className="mini-nav">
              {['all', 'media', 'games', 'secret'].map((p) => (
                <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>
                  {p === 'all' ? '67' : p}
                </button>
              ))}
            </nav>

            {page === 'all' && (
              <section className="memory-page">
                <div className="photo-grid">
                  {CONFIG.memories.photos.map((p) => (
                    <figure className="photo-card" key={p.src}>
                      <img src={p.src} alt="memory" />
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {page === 'media' && (
              <section className="memory-page">
                <div className="media-grid">
                  <section className="media-col media-movies">
                    <h2>movies  that have become special to me because of you</h2>
                    <div className="movie-list scroll-col">
                      {CONFIG.memories.movies.map((m) => (
                        <article className="movie-card review-card" key={m.title}>
                          <img src={m.poster} alt={`${m.title} poster`} />
                          <div className="movie-info">
                            <p className="movie-title">{m.title} <span>({m.year})</span></p>
                            <div className="movie-stars">
                              {stars(m.rating).map((s, i) => <span key={`${m.title}-${i}`} className={`star ${s}`}>★</span>)}
                            </div>
                            <p className="review-text">{m.review}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="media-col media-songs">
                    <h2>songs</h2>
                    <div className="songs-list scroll-col">
                      {CONFIG.songs.map((track, index) => (
                        <button key={`${track.title}-${index}`} className={`song-row ${index === trackIndex ? 'active' : ''}`} onClick={() => pickTrack(index)}>
                          <img src={track.cover} alt={track.title} />
                          <span><strong>{track.title}</strong><em>{track.artist}</em></span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </section>
            )}

            {page === 'games' && (
              <section className="memory-page">
                <div className="games-intro">
                  <p>lock in and warm up here. i'm making you a vct player</p>
                </div>
                <div className="games-menu">
                  {['puzzle', 'reaction', 'shooter', 'sequence'].map((g) => (
                    <button key={g} className={activeGame === g ? 'active' : ''} onClick={() => setActiveGame(g)}>{g}</button>
                  ))}
                </div>

                {activeGame === 'puzzle' && (
                  <div className="game-card puzzle-game">
                    <div className="puzzle-header">
                      <p>{puzzleSolved ? 'You solved it! <3' : puzzleGameOver ? 'Out of moves! :(' : 'slide the tiles to fix the map:'}</p>
                      <span className={`moves-counter ${puzzleMoves > PUZZLE_MAX_MOVES * 0.8 ? 'warning' : ''}`}>
                        moves: <strong>{puzzleMoves}/{PUZZLE_MAX_MOVES}</strong>
                      </span>
                    </div>
                    <div className={`puzzle-grid ${puzzleGameOver ? 'game-over' : ''}`}>
                      {puzzleGrid.map((val, i) => (
                        <div 
                          key={i} 
                          className={`puzzle-tile ${val === 8 ? 'empty' : ''}`}
                          onClick={() => movePiece(i)}
                          style={val !== 8 ? {
                            backgroundImage: `url(${puzzleImage})`,
                            backgroundPosition: `${(val % 3) * 50}% ${Math.floor(val / 3) * 50}%`,
                            backgroundSize: '300% 300%'
                          } : {}}
                        >
                          {val !== 8 && <span className="tile-num">{val + 1}</span>}
                        </div>
                      ))}
                    </div>
                    <button className="primary-btn" onClick={newPuzzle}>{puzzleGameOver ? 'try again' : 'new puzzle'}</button>
                    {puzzleSolved && <p className="status success">Amazing! i love you!</p>}
                    {puzzleGameOver && <p className="status error">Too many moves! You'll get it next time!</p>}
                  </div>
                )}

                {activeGame === 'reaction' && (
                  <div className={`game-card reaction-game phase-${reactionPhase}`}>
                    <div 
                      className="reaction-area" 
                      onClick={tapReaction}
                    >
                      {reactionPhase === 'idle' && <p>best: {reactionBest ? `${reactionBest}ms` : '---'}</p>}
                      <h3>{reactionMsg}</h3>
                      {reactionPhase === 'idle' && <button className="primary-btn" onClick={(e) => { e.stopPropagation(); startReaction(); }}>start</button>}
                    </div>
                  </div>
                )}

                {activeGame === 'shooter' && (
                  <div className="game-card shooter-game">
                    <div className="shooter-stats">
                      <span>Score: <strong>{shooterScore}</strong></span>
                      <span>Time: <strong>{shooterTime}s</strong></span>
                    </div>
                    {!shooterRunning && (
                      <button className="primary-btn start-overlay" onClick={startShooter}>
                        {shooterScore > 0 ? 'Play Again' : 'start game'}
                      </button>
                    )}
                    <div className="shooter-zone">
                      {targets.map((t) => (
                        <button 
                          key={t.id} 
                          className="target-orb" 
                          style={{ left: `${t.x}%`, top: `${t.y}%` }} 
                          onClick={() => shoot(t.id)}
                        >
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeGame === 'sequence' && (
                  <div className="game-card sequence-game">
                    <p className="level-badge">Level {seqLevel}</p>
                    <p className="game-status">{seqStatus}</p>
                    <div className="sequence-grid">
                      {[1, 2, 3, 4].map((n) => (
                        <button 
                          key={n} 
                          className={`seq-btn ${seqActive === n ? 'active' : ''}`} 
                          onClick={() => pressSeq(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    {!seqPattern.length && (
                      <button className="primary-btn" onClick={startSequence}>
                        {seqLevel > 1 ? 'Next Level' : 'start'}
                      </button>
                    )}
                  </div>
                )}
              </section>
            )}

            {page === 'secret' && (
              <section className="memory-page">
                <div className="askout-panel">
                  {!secretOk && (
                    <div className="riddle-container">
                      <h2>riddle: anong T ang pinipisil at may lumalabas na puti?</h2>
                      <input value={secret} placeholder="answer the secret riddle" onChange={(e) => setSecret(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && unlockSecret()} />
                      <button className="primary-btn" onClick={unlockSecret}>unlock</button>
                      {status && <p className="status">{status}</p>}
                    </div>
                  )}
                  {secretOk && (
                    <div className="reveal-container">
                      <div className="game-card letter-card">

                        <h2>hi pia,</h2>
                        <div className="letter-body">
                          <p>every moment spent with you is a chance to fall in love over and over again. i'm lucky to have met you.</p>
                          <p>jowain mo na ako parang awa mo na</p>
                        </div>
                      </div>

                      {ask !== 'YES' ? (
                        <div className="ask-box">
                          <h3>be my girlfriend?</h3>
                          <div className="ask-zone" ref={askRef}>
                            <button className="primary-btn" onClick={() => setAsk('YES')}>yes</button>
                            <button className="no-btn" style={{ left: `${noPos.x}px`, top: `${noPos.y}px` }} onMouseEnter={moveNo} onClick={moveNo}>no</button>
                          </div>
                        </div>
                      ) : (
                        <div className="yes-reveal">
                          <img src="/Keroppi.gif" alt="celebration" className="reveal-gif" />
                          <h2> TYL! <span className="heart-bounce"></span></h2>
                          <p>i love you</p>
                          <img src="/pompurin.png" alt="cute" className="reveal-sticker" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}
          </main>

          <aside className="ipod">
            <audio
              ref={audioRef}
              src={currentTrack?.file}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={nextTrack}
              onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
            />
            <div className="ipod-screen">
              {!showPlaylist && (
                <>
                  <p className="ipod-label">Now Playing</p>
                  <div className="ipod-track">
                    <img src={currentTrack?.cover} alt={currentTrack?.title} />
                    <div>
                      <strong>{currentTrack?.title}</strong>
                      <em>{currentTrack?.artist}</em>
                    </div>
                  </div>
                  <div className="ipod-progress">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                    />
                    <div className="ipod-times">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </>
              )}
              {showPlaylist && (
                <div className="ipod-list">
                  {CONFIG.songs.map((song, idx) => (
                    <button key={`${song.title}-${idx}`} className={idx === trackIndex ? 'active' : ''} onClick={() => pickTrack(idx)}>
                      {song.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="click-wheel">
              <button className="wheel-menu" onClick={() => setShowPlaylist((v) => !v)}>MENU</button>
              <button className="wheel-prev" onClick={prevTrack}>◀◀</button>
              <button className="wheel-next" onClick={nextTrack}>▶▶</button>
              <button className="wheel-play" onClick={() => setIsPlaying((v) => !v)}>
                {isPlaying ? 'pause' : 'play'}
              </button>
              <div className="wheel-center" />
            </div>
            <div className="ipod-meta">
              <span>{trackIndex + 1}/{CONFIG.songs.length}</span>
              <span>{isPlaying ? 'playing' : 'paused'}</span>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
