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
    return window.localStorage.getItem(ACTIVE_PAGE_STORAGE_KEY) || 'all'
  })
  const [showAllMovies, setShowAllMovies] = useState(true)
  const [showAllReviews, setShowAllReviews] = useState(true)
  const [askResponse, setAskResponse] = useState('')
  const [noButtonPos, setNoButtonPos] = useState({ x: 170, y: 0 })
  const [secretAnswer, setSecretAnswer] = useState('')
  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [secretStatus, setSecretStatus] = useState('')

  const audioRef = useRef(null)
  const askZoneRef = useRef(null)

  const playlist = CONFIG.playlist.length ? CONFIG.playlist : [{ title: 'No songs', artist: 'Add songs in CONFIG', file: '', cover: '' }]
  const currentTrack = playlist[trackIndex] || playlist[0]
  const moviesToShow = showAllMovies ? CONFIG.memories.movies : CONFIG.memories.movies.slice(0, 3)
  const reviewsToShow = showAllReviews ? CONFIG.memories.movies : CONFIG.memories.movies.slice(0, 3)

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
  }, [trackIndex])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(ACTIVE_PAGE_STORAGE_KEY, activePage)
  }, [activePage])

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
              {['all', 'movies', 'reviews', 'secret'].map((page) => (
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

          {(activePage === 'all' || activePage === 'movies') && (
            <section className="memory-page">
              {activePage === 'all' && (
                <div className="photo-grid">
                  {CONFIG.memories.photos.map((photo) => (
                    <figure className="photo-card" key={photo.src}>
                      <img src={photo.src} alt="Memory photo" />
                    </figure>
                  ))}
                </div>
              )}

              {(activePage === 'all' || activePage === 'movies') && (
                <div className="movies-section">
                  <div className="section-top">
                    <h2>movies we watched</h2>
                    <button className="see-all-btn" onClick={() => setShowAllMovies((prev) => !prev)}>
                      {showAllMovies ? 'Show less' : 'See all'}
                    </button>
                  </div>
                  <div className="movie-list">
                    {moviesToShow.map((movie) => (
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
              )}
            </section>
          )}

          {(activePage === 'all' || activePage === 'reviews') && (
            <section className="reviews-bottom">
              <div className="section-top">
                <h2>our reviews</h2>
                <button className="see-all-btn" onClick={() => setShowAllReviews((prev) => !prev)}>
                  {showAllReviews ? 'Show less' : 'See all'}
                </button>
              </div>
              <div className="review-feed">
                {reviewsToShow.map((movie) => (
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
