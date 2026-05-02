import { useEffect, useRef, useState } from 'react'

const CONFIG = {
  personName: 'pia',
  accessPassword: 'c3QTGoGvXgtTFWdpnrKj3msy0F9dmpyztGRLpKdfR3U9E1EXb5', // Change this and share it with her directly.
  playlist: [
    {
      title: 'Magnets',
      artist: 'NIKI',
      file: '/magnets.mp3',
      cover: '/magnets.jpg',
    },
    {
      title: 'Song Two',
      artist: 'Your Artist',
      file: '/song-2.mp3',
      cover: '/cover-2.jpg',
    },
  ],
  memories: {
    photos: [
      { src: '/yunjin1.jpg' },
      { src: '/jungwon1.jpg' },
      { src: '/yunjin2.jpg' },
      { src: '/jungwon2.jpg' },
    ],
    movies: [
      {
        title: 'Mulholland Drive',
        year: '2001',
        rating: 5,
        poster: '/mulholland-drive.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Conclave',
        year: '2024',
        rating: 4.5,
        poster: '/conclave.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Dune',
        year: '2021',
        rating: 4,
        poster: '/dune.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Dune Part Two',
        year: '2024',
        rating: 5,
        poster: '/dune-part-two.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Before Sunrise',
        year: '1995',
        rating: 4.5,
        poster: '/before-sunrise.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Two People Exchanging Saliva',
        year: '2024',
        rating: 4,
        poster: '/two-people-exchanging-saliva.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Monster',
        year: '2023',
        rating: 4.5,
        poster: '/monster.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Manila in the Claws of Light',
        year: '1975',
        rating: 4.5,
        poster: '/manila-in-the-claws-of-light.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Atonement',
        year: '2007',
        rating: 4,
        poster: '/atonement.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Mysterious Skin',
        year: '2004',
        rating: 4,
        poster: '/mysterious-skin.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Scream V',
        year: '2022',
        rating: 2.5,
        poster: '/scream-v.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Parasite',
        year: '2019',
        rating: 5,
        poster: '/parasite.jpg',
        review: 'Add your review here.',
      },
      {
        title: 'Possession',
        year: '1981',
        rating: 4,
        poster: '/possession.jpg',
        review: 'Add your review here.',
      },
    ],
  },
}

function normalize(value) {
  return value.trim().toLowerCase()
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function toFiveStarScore(rating) {
  if (typeof rating === 'number') return Math.max(0, Math.min(5, rating))

  const raw = String(rating || '').trim()
  if (raw.includes('/10')) {
    const value = Number(raw.replace('/10', ''))
    if (Number.isFinite(value)) return Math.max(0, Math.min(5, value / 2))
  }

  const value = Number(raw)
  if (Number.isFinite(value)) return Math.max(0, Math.min(5, value))
  return 0
}

function renderStars(rating) {
  const score = toFiveStarScore(rating)
  const fullStars = Math.floor(score)
  const hasHalf = score - fullStars >= 0.5

  return Array.from({ length: 5 }, (_, index) => {
    if (index < fullStars) return 'full'
    if (index === fullStars && hasHalf) return 'half'
    return 'empty'
  })
}

const HEARTS = [
  { left: '8%', top: '12%', delay: '0s', size: '16px' },
  { left: '19%', top: '42%', delay: '0.8s', size: '13px' },
  { left: '28%', top: '20%', delay: '1.5s', size: '12px' },
  { left: '42%', top: '9%', delay: '2.2s', size: '14px' },
  { left: '53%', top: '73%', delay: '3s', size: '15px' },
  { left: '67%', top: '16%', delay: '1.1s', size: '12px' },
  { left: '78%', top: '62%', delay: '2.9s', size: '16px' },
  { left: '87%', top: '27%', delay: '0.5s', size: '11px' },
  { left: '90%', top: '78%', delay: '1.9s', size: '14px' },
]

const UNLOCK_STORAGE_KEY = 'date-site-unlocked'
const ACTIVE_PAGE_STORAGE_KEY = 'date-site-active-page'
const REACTION_BEST_STORAGE_KEY = 'date-site-reaction-best-ms'
const SHOOTER_BEST_STORAGE_KEY = 'date-site-shooter-best-score'
const SEQUENCE_BEST_STORAGE_KEY = 'date-site-sequence-best-level'

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickPosterRound(movies, optionCount = 4) {
  const withPosters = (movies || []).filter((movie) => movie && movie.poster)
  if (!withPosters.length) {
    return { prompt: '', correctTitle: '', options: [] }
  }

  const correct = withPosters[Math.floor(Math.random() * withPosters.length)]
  const distractors = shuffle(withPosters.filter((movie) => movie.title !== correct.title)).slice(0, Math.max(0, optionCount - 1))
  const options = shuffle([
    { title: correct.title, poster: correct.poster, year: correct.year },
    ...distractors.map((movie) => ({ title: movie.title, poster: movie.poster, year: movie.year })),
  ])

  return {
    prompt: `Which poster is “${correct.title}”?`,
    correctTitle: correct.title,
    options,
  }
}

function scrambleTitle(title) {
  const raw = String(title || '')
  const letters = raw.replace(/[^a-z0-9]/gi, '').split('')
  if (letters.length < 4) return raw.toUpperCase()

  const shuffled = shuffle(letters)
  // avoid giving the exact same order (best effort)
  if (shuffled.join('') === letters.join('')) {
    shuffled.reverse()
  }
  return shuffled.join('').toUpperCase()
}

function pickTitlePuzzle(movies) {
  const list = (movies || []).filter((movie) => movie && movie.title)
  if (!list.length) {
    return { movie: null, scrambled: '', hint: '', answer: '' }
  }

  const movie = list[Math.floor(Math.random() * list.length)]
  const answer = String(movie.title || '')
  const hint = movie.year ? `hint: ${movie.year}` : 'hint: from our list'

  return { movie, scrambled: scrambleTitle(answer), hint, answer }
}

function nextSequence(length) {
  return Array.from({ length }, () => 1 + Math.floor(Math.random() * 4))
}

function makeCodebreakerSecret() {
  // 4 digits, 1-6 (duplicates allowed)
  return Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6))
}

function scoreCodebreakerGuess(secret, guess) {
  // returns { exact, near }
  const s = [...secret]
  const g = [...guess]

  let exact = 0
  for (let i = 0; i < 4; i += 1) {
    if (g[i] === s[i]) {
      exact += 1
      s[i] = null
      g[i] = null
    }
  }

  let near = 0
  for (let i = 0; i < 4; i += 1) {
    if (g[i] == null) continue
    const idx = s.indexOf(g[i])
    if (idx !== -1) {
      near += 1
      s[idx] = null
    }
  }

  return { exact, near }
}

export default function App() {
  const [passInput, setPassInput] = useState('')
  const [passStatus, setPassStatus] = useState('')
  const [siteUnlocked, setSiteUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(UNLOCK_STORAGE_KEY) === 'true'
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [menuOpen, setMenuOpen] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [activePage, setActivePage] = useState(() => {
    if (typeof window === 'undefined') return 'all'
    const saved = window.localStorage.getItem(ACTIVE_PAGE_STORAGE_KEY) || 'all'
    if (['all', 'media', 'games', 'secret'].includes(saved)) return saved
    if (saved === 'movies' || saved === 'reviews') return 'media'
    return 'all'
  })
  const [askResponse, setAskResponse] = useState('')
  const [noButtonPos, setNoButtonPos] = useState({ x: 170, y: 0 })
  const [secretAnswer, setSecretAnswer] = useState('')
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [secretStatus, setSecretStatus] = useState('')

  const audioRef = useRef(null)
  const askZoneRef = useRef(null)

  const playlist = CONFIG.playlist.length ? CONFIG.playlist : [{ title: 'No songs', artist: 'Add songs in CONFIG', file: '', cover: '' }]
  const currentTrack = playlist[trackIndex] || playlist[0]

  const [moviePuzzle, setMoviePuzzle] = useState(() => pickTitlePuzzle(CONFIG.memories.movies))
  const [puzzleInput, setPuzzleInput] = useState('')
  const [puzzleStatus, setPuzzleStatus] = useState('')
  const [puzzleShowHint, setPuzzleShowHint] = useState(false)
  const [puzzleScore, setPuzzleScore] = useState(0)
  const [puzzleStreak, setPuzzleStreak] = useState(0)

  const [reactionPhase, setReactionPhase] = useState('idle') // idle | waiting | go | done
  const [reactionMessage, setReactionMessage] = useState('Press start, then tap the heart as soon as it appears.')
  const [reactionLastMs, setReactionLastMs] = useState(null)
  const [reactionBestMs, setReactionBestMs] = useState(() => {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(REACTION_BEST_STORAGE_KEY)
    const value = raw ? Number(raw) : null
    return Number.isFinite(value) ? value : null
  })
  const reactionTimeoutRef = useRef(null)
  const reactionStartRef = useRef(0)

  const [shooterRunning, setShooterRunning] = useState(false)
  const [shooterScore, setShooterScore] = useState(0)
  const [shooterTimeLeft, setShooterTimeLeft] = useState(30)
  const [shooterLives, setShooterLives] = useState(3)
  const [shooterTargets, setShooterTargets] = useState([])
  const [shooterMessage, setShooterMessage] = useState('Press start. Pop as many targets as you can.')
  const [shooterBestScore, setShooterBestScore] = useState(() => {
    if (typeof window === 'undefined') return 0
    const raw = window.localStorage.getItem(SHOOTER_BEST_STORAGE_KEY)
    const value = raw ? Number(raw) : 0
    return Number.isFinite(value) ? value : 0
  })
  const shooterSpawnRef = useRef(null)
  const shooterTickRef = useRef(null)
  const shooterClockRef = useRef(null)
  const shooterIdRef = useRef(1)
  const shooterScoreRef = useRef(0)
  const shooterLivesRef = useRef(3)

  const [sequenceLevel, setSequenceLevel] = useState(1)
  const [sequencePattern, setSequencePattern] = useState([])
  const [sequenceInput, setSequenceInput] = useState([])
  const [sequenceShow, setSequenceShow] = useState(false)
  const [sequenceStatus, setSequenceStatus] = useState('Press start to begin.')
  const [sequenceBest, setSequenceBest] = useState(() => {
    if (typeof window === 'undefined') return 1
    const raw = window.localStorage.getItem(SEQUENCE_BEST_STORAGE_KEY)
    const value = raw ? Number(raw) : 1
    return Number.isFinite(value) ? Math.max(1, value) : 1
  })
  const sequenceTimeoutRef = useRef(null)

  const [codeSecret, setCodeSecret] = useState(() => makeCodebreakerSecret())
  const [codeGuess, setCodeGuess] = useState([1, 1, 1, 1])
  const [codeTurnsLeft, setCodeTurnsLeft] = useState(10)
  const [codeHistory, setCodeHistory] = useState([])
  const [codeStatus, setCodeStatus] = useState('Crack the code: 4 digits (1–6).')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentTime(0)
    setDuration(0)

    if (isPlaying && currentTrack.file) {
      audio.play().catch(() => {
        setIsPlaying(false)
      })
    }
  }, [trackIndex, isPlaying])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(ACTIVE_PAGE_STORAGE_KEY, activePage)
  }, [activePage])

  useEffect(() => {
    shooterScoreRef.current = shooterScore
  }, [shooterScore])

  useEffect(() => {
    shooterLivesRef.current = shooterLives
  }, [shooterLives])

  useEffect(() => {
    if (activePage !== 'games') return
    setPuzzleStatus('')
    setPuzzleInput('')
    setPuzzleShowHint(false)
    setMoviePuzzle(pickTitlePuzzle(CONFIG.memories.movies))
    setCodeSecret(makeCodebreakerSecret())
    setCodeGuess([1, 1, 1, 1])
    setCodeTurnsLeft(10)
    setCodeHistory([])
    setCodeStatus('Crack the code: 4 digits (1–6).')
  }, [activePage])

  useEffect(() => {
    if (activePage === 'games') return

    if (reactionTimeoutRef.current) {
      window.clearTimeout(reactionTimeoutRef.current)
      reactionTimeoutRef.current = null
    }
    setReactionPhase('idle')

    if (shooterSpawnRef.current || shooterTickRef.current || shooterClockRef.current) {
      stopShooter(shooterScoreRef.current)
    }

    if (sequenceTimeoutRef.current) {
      window.clearTimeout(sequenceTimeoutRef.current)
      sequenceTimeoutRef.current = null
    }
    setSequenceShow(false)
  }, [activePage])

  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current) {
        window.clearTimeout(reactionTimeoutRef.current)
        reactionTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (shooterSpawnRef.current) window.clearInterval(shooterSpawnRef.current)
      if (shooterTickRef.current) window.clearInterval(shooterTickRef.current)
      if (shooterClockRef.current) window.clearInterval(shooterClockRef.current)
      shooterSpawnRef.current = null
      shooterTickRef.current = null
      shooterClockRef.current = null
      if (sequenceTimeoutRef.current) {
        window.clearTimeout(sequenceTimeoutRef.current)
        sequenceTimeoutRef.current = null
      }
    }
  }, [])

  function unlockSite() {
    if (normalize(passInput) === normalize(CONFIG.accessPassword)) {
      setPassStatus('password works. come in.')
      setSiteUnlocked(true)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(UNLOCK_STORAGE_KEY, 'true')
      }
      return
    }

    setPassStatus('wrong password. try again.')
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || !currentTrack.file) return

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  function setTrack(nextIndex) {
    const bounded = (nextIndex + playlist.length) % playlist.length
    setTrackIndex(bounded)
    setMenuOpen(false)
  }

  function nextTrack() {
    setTrack(trackIndex + 1)
  }

  function prevTrack() {
    setTrack(trackIndex - 1)
  }

  function handleSeek(event) {
    const audio = audioRef.current
    if (!audio) return
    const nextTime = Number(event.target.value)
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function unlockSecret() {
    if (normalize(secretAnswer) === 'toothpaste') {
      setSecretUnlocked(true)
      setSecretStatus('secret unlocked')
      return
    }
    setSecretStatus('wrong answer, try again')
  }

  function moveNoButton() {
    const zone = askZoneRef.current
    if (!zone) return

    const rect = zone.getBoundingClientRect()
    const maxX = Math.max(rect.width - 62, 6)
    const maxY = Math.max(rect.height - 30, 0)

    setNoButtonPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    })
  }

  function nextPuzzle() {
    setPuzzleStatus('')
    setPuzzleInput('')
    setPuzzleShowHint(false)
    setMoviePuzzle(pickTitlePuzzle(CONFIG.memories.movies))
  }

  function submitPuzzle() {
    if (!moviePuzzle?.answer) return
    if (!puzzleInput.trim()) return

    const correct = normalize(puzzleInput) === normalize(moviePuzzle.answer)
    if (correct) {
      setPuzzleStatus('correct!')
      setPuzzleScore((prev) => prev + 1)
      setPuzzleStreak((prev) => prev + 1)
      return
    }

    setPuzzleStatus(`not quite — answer: “${moviePuzzle.answer}”.`)
    setPuzzleStreak(0)
  }

  function startReaction() {
    if (reactionTimeoutRef.current) {
      window.clearTimeout(reactionTimeoutRef.current)
      reactionTimeoutRef.current = null
    }

    setReactionLastMs(null)
    setReactionPhase('waiting')
    setReactionMessage('Wait for it…')

    const delay = 900 + Math.floor(Math.random() * 1800)
    reactionTimeoutRef.current = window.setTimeout(() => {
      reactionTimeoutRef.current = null
      reactionStartRef.current = performance.now()
      setReactionPhase('go')
      setReactionMessage('NOW!')
    }, delay)
  }

  function tapReaction() {
    if (reactionPhase !== 'go') {
      if (reactionPhase === 'waiting') {
        if (reactionTimeoutRef.current) {
          window.clearTimeout(reactionTimeoutRef.current)
          reactionTimeoutRef.current = null
        }
        setReactionPhase('idle')
        setReactionMessage('Too early. Press start again.')
      }
      return
    }

    const ms = Math.max(0, Math.round(performance.now() - reactionStartRef.current))
    setReactionPhase('done')
    setReactionLastMs(ms)
    setReactionMessage(`${ms} ms`)

    setReactionBestMs((prev) => {
      const next = prev == null || ms < prev ? ms : prev
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(REACTION_BEST_STORAGE_KEY, String(next))
      }
      return next
    })
  }

  function stopShooter(finalScore) {
    if (shooterSpawnRef.current) window.clearInterval(shooterSpawnRef.current)
    if (shooterTickRef.current) window.clearInterval(shooterTickRef.current)
    if (shooterClockRef.current) window.clearInterval(shooterClockRef.current)
    shooterSpawnRef.current = null
    shooterTickRef.current = null
    shooterClockRef.current = null

    setShooterRunning(false)
    setShooterTargets([])

    setShooterBestScore((prev) => {
      const next = Math.max(prev || 0, finalScore || 0)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SHOOTER_BEST_STORAGE_KEY, String(next))
      }
      return next
    })
  }

  function startShooter() {
    // reset
    setShooterRunning(true)
    setShooterScore(0)
    setShooterTargets([])
    setShooterTimeLeft(30)
    setShooterLives(3)
    setShooterMessage('Go!')

    if (shooterSpawnRef.current) window.clearInterval(shooterSpawnRef.current)
    if (shooterTickRef.current) window.clearInterval(shooterTickRef.current)
    if (shooterClockRef.current) window.clearInterval(shooterClockRef.current)

    const shapes = ['circle', 'square', 'diamond']
    shooterSpawnRef.current = window.setInterval(() => {
      const id = shooterIdRef.current++
      const target = {
        id,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        x: 8 + Math.random() * 84, // percent
        y: 10 + Math.random() * 78, // percent
        bornAt: Date.now(),
        ttlMs: 2200,
      }
      setShooterTargets((prev) => [...prev, target].slice(-14))
    }, 650)

    shooterTickRef.current = window.setInterval(() => {
      const now = Date.now()
      setShooterTargets((prev) => {
        const moved = prev
          .map((t) => ({
            ...t,
            x: Math.max(4, Math.min(92, t.x + (Math.random() - 0.5) * 6)),
            y: Math.max(6, Math.min(88, t.y + (Math.random() - 0.5) * 6)),
          }))
        const alive = moved.filter((t) => now - t.bornAt < t.ttlMs)
        const missed = moved.length - alive.length

        if (missed > 0) {
          setShooterLives((prevLives) => {
            const nextLives = prevLives - missed
            if (nextLives <= 0) {
              setShooterMessage('Out of lives!')
              stopShooter(shooterScoreRef.current)
              return 0
            }
            return nextLives
          })
        }

        return alive
      })
    }, 140)

    shooterClockRef.current = window.setInterval(() => {
      setShooterTimeLeft((prev) => {
        const next = prev - 1
        if (next <= 0) {
          setShooterMessage('Time!')
          stopShooter(shooterScoreRef.current)
          return 0
        }
        return next
      })
    }, 1000)
  }

  function shootTarget(id) {
    if (!shooterRunning) return
    setShooterTargets((prev) => prev.filter((t) => t.id !== id))
    setShooterScore((prev) => prev + 1)
  }

  function startSequenceGame() {
    if (sequenceTimeoutRef.current) {
      window.clearTimeout(sequenceTimeoutRef.current)
      sequenceTimeoutRef.current = null
    }
    const pattern = nextSequence(3)
    setSequenceLevel(1)
    setSequencePattern(pattern)
    setSequenceInput([])
    setSequenceShow(true)
    setSequenceStatus('Memorize the pattern...')
    sequenceTimeoutRef.current = window.setTimeout(() => {
      setSequenceShow(false)
      setSequenceStatus('Repeat the pattern.')
      sequenceTimeoutRef.current = null
    }, 1800)
  }

  function pressSequence(value) {
    if (!sequencePattern.length || sequenceShow) return
    const nextInput = [...sequenceInput, value]
    const expected = sequencePattern[nextInput.length - 1]

    if (value !== expected) {
      setSequenceStatus(`Wrong. Pattern was ${sequencePattern.join(' ')}`)
      setSequenceInput([])
      setSequencePattern([])
      return
    }

    if (nextInput.length === sequencePattern.length) {
      const nextLevel = sequenceLevel + 1
      const nextPattern = nextSequence(nextLevel + 2)
      setSequenceLevel(nextLevel)
      setSequencePattern(nextPattern)
      setSequenceInput([])
      setSequenceShow(true)
      setSequenceStatus(`Nice! Level ${nextLevel}.`)
      setSequenceBest((prev) => {
        const best = Math.max(prev, nextLevel)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(SEQUENCE_BEST_STORAGE_KEY, String(best))
        }
        return best
      })
      sequenceTimeoutRef.current = window.setTimeout(() => {
        setSequenceShow(false)
        setSequenceStatus('Repeat the pattern.')
        sequenceTimeoutRef.current = null
      }, Math.max(1200, 2200 - nextLevel * 120))
      return
    }

    setSequenceInput(nextInput)
    setSequenceStatus(`Good... ${nextInput.length}/${sequencePattern.length}`)
  }

  function newCodebreaker() {
    setCodeSecret(makeCodebreakerSecret())
    setCodeGuess([1, 1, 1, 1])
    setCodeTurnsLeft(10)
    setCodeHistory([])
    setCodeStatus('New code. Good luck.')
  }

  function setCodeGuessDigit(index, value) {
    const digit = Math.max(1, Math.min(6, Number(value) || 1))
    setCodeGuess((prev) => prev.map((d, i) => (i === index ? digit : d)))
  }

  function submitCodeGuess() {
    if (codeTurnsLeft <= 0) return
    const guess = [...codeGuess]
    const scored = scoreCodebreakerGuess(codeSecret, guess)
    const nextTurns = codeTurnsLeft - 1

    setCodeHistory((prev) => [{ guess, ...scored }, ...prev].slice(0, 8))
    setCodeTurnsLeft(nextTurns)

    if (scored.exact === 4) {
      setCodeStatus('Cracked it!')
      setCodeTurnsLeft(0)
      return
    }

    if (nextTurns <= 0) {
      setCodeStatus(`Out of turns. Code was ${codeSecret.join(' ')}`)
      return
    }

    setCodeStatus(`Exact: ${scored.exact} · Near: ${scored.near} · Turns left: ${nextTurns}`)
  }

  useEffect(() => {
    if (!shooterRunning) return
    setShooterMessage(`Time left: ${shooterTimeLeft}s`)
  }, [shooterRunning, shooterTimeLeft])

  useEffect(() => {
    if (!shooterRunning) return
    if (shooterTimeLeft === 0) {
      stopShooter(shooterScore)
    }
  }, [shooterRunning, shooterTimeLeft, shooterScore])

  return (
    <div className="app">
      <div className="hearts-layer" aria-hidden>
        {HEARTS.map((heart, index) => (
          <span
            key={index}
            className="heart"
            style={{ left: heart.left, top: heart.top, animationDelay: heart.delay, fontSize: heart.size }}
          >
            ❤
          </span>
        ))}
      </div>

      {!siteUnlocked && (
        <section className="card">
          <>
            <div className="plan-box">
              <p>hi, enter password</p>
            </div>

            <input
              value={passInput}
              placeholder="type password here"
              onChange={(event) => setPassInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && unlockSite()}
            />

            <div className="row">
              <button className="button yes" onClick={unlockSite}>open it</button>
            </div>

            <p className="status">
              <span className={passStatus.includes('works') ? 'ok' : 'err'}>{passStatus}</span>
            </p>
          </>
        </section>
      )}

      {siteUnlocked && (
        <main className="memory-layout">
          <header className="memory-header">
            <h1 className="title">sdasdasda</h1>
            <nav className="mini-nav" aria-label="Memory pages">
              {['all', 'media', 'games', 'secret'].map((page) => (
                <button
                  key={page}
                  className={activePage === page ? 'active' : ''}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </button>
              ))}
            </nav>
          </header>

          {activePage === 'secret' && (
            <section className="askout-panel">
              <p className="askout-title">secret</p>
              {!secretUnlocked && (
                <>
                  <h2>riddle: anong T ang pinipisil at may lumalabas na puti?</h2>
                  <input
                    value={secretAnswer}
                    placeholder="answer the riddle"
                    onChange={(event) => setSecretAnswer(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && unlockSecret()}
                  />
                  <div className="row">
                    <button className="see-all-btn" onClick={unlockSecret}>unlock</button>
                  </div>
                  {secretStatus && <p className="askout-response">{secretStatus}</p>}
                </>
              )}
              {secretUnlocked && (
                <>
                  <h2>will you go out with me?</h2>
                  <div className="askout-zone" ref={askZoneRef}>
                    <button className="ask-btn yes" onClick={() => setAskResponse('YES!!!')}>
                      Yes
                    </button>
                    <button className="ask-btn maybe" onClick={() => setAskResponse('Maybe is acceptable, but I am campaigning for Yes.')}>
                      Maybe
                    </button>
                    <button
                      className="ask-btn no-run"
                      style={{ left: `${noButtonPos.x}px`, top: `${noButtonPos.y}px` }}
                      onMouseEnter={moveNoButton}
                      onTouchStart={moveNoButton}
                      onClick={moveNoButton}
                    >
                      No
                    </button>
                  </div>
                  {askResponse && <p className="askout-response">{askResponse}</p>}
                </>
              )}
            </section>
          )}

          {activePage === 'all' && (
            <section className="memory-page">
              <div className="photo-grid">
                {CONFIG.memories.photos.map((photo) => (
                  <figure className="photo-card" key={photo.src}>
                    <img src={photo.src} alt="Memory photo" />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {activePage === 'media' && (
            <section className="memory-page">
              <div className="media-grid">
                <div className="movies-section media-col media-col-movies">
                  <div className="section-top">
                    <h2>movies</h2>
                  </div>
                  <div className="movie-list">
                    {CONFIG.memories.movies.map((movie) => (
                      <article className="movie-card" key={movie.title}>
                        <p className="movie-title">{movie.title} <span>({movie.year})</span></p>
                        <p className="movie-rating-stars" aria-label={`Rating: ${movie.rating}`}>
                          {renderStars(movie.rating).map((state, index) => (
                            <span key={`${movie.title}-star-${index}`} className={`star ${state}`}>
                              ★
                            </span>
                          ))}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="reviews-bottom media-col media-col-reviews">
                  <div className="section-top">
                    <h2>reviews</h2>
                  </div>
                  <div className="review-feed compact">
                    {CONFIG.memories.movies.map((movie) => (
                      <article className="review-entry" key={`${movie.title}-review`}>
                        <img className="review-poster" src={movie.poster} alt={`${movie.title} poster`} />
                        <div className="review-body">
                          <p className="review-title">
                            {movie.title} <span>({movie.year})</span>
                          </p>
                          <p className="review-stars" aria-label={`Rating: ${movie.rating}`}>
                            {renderStars(movie.rating).map((state, index) => (
                              <span key={`${movie.title}-review-star-${index}`} className={`star ${state}`}>
                                ★
                              </span>
                            ))}
                          </p>
                          <p className="review-text">{movie.review}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="songs-section media-col media-col-songs">
                  <div className="section-top">
                    <h2>songs</h2>
                  </div>
                  <div className="songs-list">
                    {playlist.map((track, index) => (
                      <button
                        key={`${track.title}-${index}`}
                        type="button"
                        className={`song-row ${index === trackIndex ? 'active' : ''}`}
                        onClick={() => {
                          setTrack(index)
                          setIsPlaying(true)
                        }}
                      >
                        <img src={track.cover} alt={track.title} />
                        <span>
                          <strong>{track.title}</strong>
                          <em>{track.artist}</em>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activePage === 'games' && (
            <section className="memory-page">
              <div className="mini-games-section">
                <div className="section-top">
                  <h2>mini games</h2>
                </div>
                <div className="mini-games-stack">
                  <div className="movie-mini-game game-card game-scramble" role="group" aria-label="Movie puzzle">
                    <p className="movie-mini-kicker">mini puzzle</p>
                    <div className="movie-mini-top">
                      <p className="movie-mini-prompt">unscramble the movie title</p>
                      <p className="movie-mini-score">
                        score <strong>{puzzleScore}</strong> · streak <strong>{puzzleStreak}</strong>
                      </p>
                    </div>

                    <p className="movie-puzzle-scramble" aria-label="Scrambled letters">
                      {moviePuzzle.scrambled || 'Add movies in CONFIG to play.'}
                    </p>

                    <div className="movie-puzzle-row">
                      <input
                        value={puzzleInput}
                        placeholder="type the title"
                        onChange={(event) => setPuzzleInput(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' && submitPuzzle()}
                      />
                      <button className="see-all-btn" type="button" onClick={submitPuzzle}>
                        check
                      </button>
                      <button className="see-all-btn" type="button" onClick={() => setPuzzleShowHint((prev) => !prev)}>
                        {puzzleShowHint ? 'hide hint' : 'hint'}
                      </button>
                    </div>

                    <div className="movie-mini-bottom">
                      <p className={`movie-mini-status ${puzzleStatus.startsWith('correct') ? 'ok' : ''}`}>{puzzleStatus}</p>
                      <button className="see-all-btn" onClick={nextPuzzle} type="button">
                        new puzzle
                      </button>
                    </div>

                    {puzzleShowHint && moviePuzzle?.hint && (
                      <p className="movie-puzzle-hint">{moviePuzzle.hint}</p>
                    )}
                  </div>

                  <div className="movie-mini-game reaction-game game-card game-reaction" role="group" aria-label="Reaction mini game">
                    <p className="movie-mini-kicker">training you to become a vct player</p>
                    <div className="movie-mini-top">
                      <p className="movie-mini-prompt">reaction time benchmark</p>
                      <p className="movie-mini-score">
                        best <strong>{reactionBestMs == null ? '—' : `${reactionBestMs}ms`}</strong>
                      </p>
                    </div>

                    <div className="reaction-zone">
                      <button className="see-all-btn" type="button" onClick={startReaction}>
                        start
                      </button>

                      <button
                        className={`reaction-heart ${reactionPhase === 'go' ? 'show' : ''}`}
                        type="button"
                        onClick={tapReaction}
                        aria-label="Tap heart"
                      >
                        ❤
                      </button>

                      <p className="reaction-message">
                        {reactionMessage}
                        {reactionLastMs != null && reactionBestMs != null && reactionLastMs === reactionBestMs ? ' (new best)' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="movie-mini-game shooter-game game-card game-shooter" role="group" aria-label="Shooting mini game">
                    <p className="movie-mini-kicker">shooting game</p>
                    <div className="movie-mini-top">
                      <p className="movie-mini-prompt">kovaak's time</p>
                      <p className="movie-mini-score">
                        best <strong>{shooterBestScore}</strong> · score <strong>{shooterScore}</strong> · time <strong>{shooterTimeLeft}s</strong> · lives <strong>{shooterLives}</strong>
                      </p>
                    </div>

                    <div className="shooter-controls">
                      <button className="see-all-btn" type="button" onClick={startShooter}>
                        {shooterRunning ? 'restart' : 'start'}
                      </button>
                      {shooterRunning && (
                        <button className="see-all-btn" type="button" onClick={() => stopShooter(shooterScore)}>
                          stop
                        </button>
                      )}
                      <p className="shooter-message">{shooterMessage}</p>
                    </div>

                    <div className={`shooter-zone ${shooterRunning ? 'running' : ''}`} aria-label="Shooter play area">
                      {shooterTargets.map((t) => (
                        <button
                          key={t.id}
                          className="shooter-target"
                          type="button"
                          style={{ left: `${t.x}%`, top: `${t.y}%` }}
                          onClick={() => shootTarget(t.id)}
                          aria-label="Pop target"
                        >
                          <span className={`shooter-shape ${t.shape}`} aria-hidden />
                        </button>
                      ))}
                      {!shooterRunning && (
                        <div className="shooter-overlay">
                          <p>Click start to play.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="movie-mini-game game-card game-sequence" role="group" aria-label="Sequence mini game">
                    <p className="movie-mini-kicker">memory challenge</p>
                    <div className="movie-mini-top">
                      <p className="movie-mini-prompt">repeat the sequence</p>
                      <p className="movie-mini-score">
                        level <strong>{sequenceLevel}</strong> · best <strong>{sequenceBest}</strong>
                      </p>
                    </div>
                    <p className="sequence-display">
                      {sequenceShow ? sequencePattern.join(' ') : sequencePattern.length ? '● '.repeat(sequencePattern.length).trim() : 'Press start'}
                    </p>
                    <div className="sequence-pad">
                      {[1, 2, 3, 4].map((num) => (
                        <button key={num} type="button" className="sequence-btn" onClick={() => pressSequence(num)}>
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="movie-mini-bottom">
                      <p className="movie-mini-status">{sequenceStatus}</p>
                      <button className="see-all-btn" type="button" onClick={startSequenceGame}>start</button>
                    </div>
                  </div>

                  <div className="movie-mini-game game-card game-math" role="group" aria-label="Math mini game">
                    <p className="movie-mini-kicker">logic puzzle</p>
                    <div className="movie-mini-top">
                      <p className="movie-mini-prompt">codebreaker</p>
                      <p className="movie-mini-score">
                        turns <strong>{codeTurnsLeft}</strong>
                      </p>
                    </div>
                    <p className="math-prompt">Guess the 4 digits (1–6). Exact = right digit + right spot. Near = right digit, wrong spot.</p>
                    <div className="codebreaker-row">
                      {codeGuess.map((digit, index) => (
                        <select
                          key={`code-digit-${index}`}
                          value={digit}
                          onChange={(event) => setCodeGuessDigit(index, event.target.value)}
                          aria-label={`Digit ${index + 1}`}
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      ))}
                      <button className="see-all-btn" type="button" onClick={submitCodeGuess}>try</button>
                      <button className="see-all-btn" type="button" onClick={newCodebreaker}>new</button>
                    </div>
                    <p className="movie-mini-status">{codeStatus}</p>
                    {codeHistory.length > 0 && (
                      <div className="codebreaker-history" aria-label="Recent guesses">
                        {codeHistory.map((row, idx) => (
                          <div className="codebreaker-line" key={`code-row-${idx}`}>
                            <span className="codebreaker-guess">{row.guess.join(' ')}</span>
                            <span className="codebreaker-score">E{row.exact} · N{row.near}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      {siteUnlocked && (
        <div className="ipod-player">
          <audio
            key={currentTrack.file}
            ref={audioRef}
            loop
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={nextTrack}
          >
            <source src={currentTrack.file} type="audio/mpeg" />
          </audio>

          <div className="ipod-screen">
            {!menuOpen && (
              <>
                <p className="ipod-title">now playing</p>
                <div className="ipod-meta">
                  <img src={currentTrack.cover} alt={currentTrack.title} />
                  <div>
                    <p className="ipod-track">{currentTrack.title}</p>
                    <p className="ipod-artist">{currentTrack.artist}</p>
                  </div>
                </div>
                <input
                  className="timeline"
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={Math.min(currentTime, duration || 0)}
                  step="0.1"
                  onChange={handleSeek}
                />
                <p className="ipod-time">{formatTime(currentTime)} / {formatTime(duration)}</p>
              </>
            )}

            {menuOpen && (
              <div className="ipod-menu">
                <p className="ipod-title">songs</p>
                <ul>
                  {playlist.map((track, index) => (
                    <li key={`${track.title}-${index}`}>
                      <button className={index === trackIndex ? 'active' : ''} onClick={() => setTrack(index)}>
                        {track.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="click-wheel">
            <button className="wheel-top" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">MENU</button>
            <button className="wheel-left" onClick={prevTrack} aria-label="Previous track">◀◀</button>
            <button className="wheel-right" onClick={nextTrack} aria-label="Next track">▶▶</button>
            <button className="wheel-center" onClick={togglePlay} aria-label="Play or pause">
              {isPlaying ? 'pause' : 'play'}
            </button>
            <p className="wheel-bottom">music</p>
          </div>

          <input
            className="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  )
}
