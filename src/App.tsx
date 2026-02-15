import { useEffect, useMemo, useState, useCallback } from 'react'
import image from './image.png'
import skinCommon1 from './image copy 2.png'
import skinCommon2 from './image copy 5.png'
import skinRare from './image copy 3.png'
import skinUncommon from './image copy 4.png'
import skinEpic from './image copy 6.png'
import skinLegendary from './image copy.png'
import './App.css'

const SKINS = [
  { name: 'Legendary', percent: 5, color: '#ffd700', skins: [skinLegendary] },
  { name: 'Epic', percent: 15, color: '#9d4edd', skins: [skinEpic] },
  { name: 'Rare', percent: 25, color: '#3a86ff', skins: [skinRare] },
  { name: 'Uncommon', percent: 30, color: '#06d6a0', skins: [skinUncommon] },
  { name: 'Common', percent: 25, color: '#8ac926', skins: [skinCommon1, skinCommon2] },
] as const

type WonTier = { name: string; color: string; skin: string }

function rollSkin(): WonTier {
  const roll = Math.random() * 100
  let acc = 0
  for (const tier of SKINS) {
    acc += tier.percent
    if (roll < acc) {
      const skin = tier.skins[Math.floor(Math.random() * tier.skins.length)]
      return { name: tier.name, color: tier.color, skin }
    }
  }
  const tier = SKINS[SKINS.length - 1]
  const skin = tier.skins[Math.floor(Math.random() * tier.skins.length)]
  return { name: tier.name, color: tier.color, skin }
}

function CaseOpening({
  phase,
  won,
  onClose,
  chestImg,
}: {
  phase: 'opening' | 'reveal'
  won: WonTier | null
  onClose: () => void
  chestImg: string
}) {
  return (
    <div className="case-overlay" onClick={phase === 'reveal' ? onClose : undefined}>
      <div className="case-modal" onClick={(e) => e.stopPropagation()}>
        {phase === 'opening' && (
          <div className="case-opening">
            <div className="case-chest-wrap">
              <img src={chestImg} alt="Chest" className="case-chest case-chest-open" />
              <div className="case-burst" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="case-burst-ray"
                    style={{ transform: `rotate(${i * 30}deg)` }}
                  />
                ))}
              </div>
            </div>
            <p className="case-opening-text">Opening...</p>
          </div>
        )}
        {phase === 'reveal' && won && (
          <div className="case-reveal">
            <div
              className="case-reveal-card"
              style={{ '--tier-color': won.color } as React.CSSProperties}
            >
              <span className="case-reveal-badge">{won.name}</span>
              <img src={won.skin} alt={won.name} className="case-reveal-skin" />
              <p className="case-reveal-name">{won.name} Drop!</p>
            </div>
            <button type="button" onClick={onClose} className="case-close-btn">
              Claim & Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SparkParticles() {
  const sparks = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      tx: (Math.random() - 0.5) * 200,
      ty: (Math.random() - 0.5) * 200,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2,
    })), []
  )

  return (
    <div className="particles" aria-hidden="true">
      {sparks.map((s) => (
        <div
          key={s.id}
          className="spark"
          style={{
            left: s.left,
            top: s.top,
            '--tx': `${s.tx}px`,
            '--ty': `${s.ty}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

function App() {
  useEffect(() => {
    document.title = 'Golden Chest | $GLDCHST'
  }, [])

  const [caseOpen, setCaseOpen] = useState<{
    phase: 'idle' | 'opening' | 'reveal'
    won: WonTier | null
  }>({ phase: 'idle', won: null })

  const openChest = useCallback(() => {
    setCaseOpen({ phase: 'opening', won: null })
    const won = rollSkin()
    setTimeout(() => setCaseOpen({ phase: 'reveal', won }), 2500)
  }, [])

  const closeCase = useCallback(() => {
    setCaseOpen({ phase: 'idle', won: null })
  }, [])

  const lootTiers = [
    { name: 'Legendary', percent: 5, color: '#ffd700', desc: 'Diamond hands', icon: '👑' },
    { name: 'Epic', percent: 15, color: '#9d4edd', desc: 'Liquidity locked', icon: '⚔️' },
    { name: 'Rare', percent: 25, color: '#3a86ff', desc: 'Marketing & growth', icon: '🛡️' },
    { name: 'Uncommon', percent: 30, color: '#06d6a0', desc: 'Community rewards', icon: '🎯' },
    { name: 'Common', percent: 25, color: '#8ac926', desc: 'Burn & ecosystem', icon: '🔥' },
  ]

  const seasons = [
    { num: 1, title: 'Drop', status: 'unlocked', items: ['Token launch', 'DEX listing', 'Community build'] },
    { num: 2, title: 'Loot', status: 'unlocked', items: ['CEX listings', 'Influencer raids', 'Meme wars'] },
    { num: 3, title: 'Victory', status: 'locked', items: ['NFT chest collection', 'Staking rewards', 'Tournament sponsors'] },
    { num: 4, title: 'Legend', status: 'locked', items: ['Cross-chain bridge', 'Game integrations', 'Golden empire'] },
  ]

  return (
    <>
      <SparkParticles />
      {caseOpen.phase !== 'idle' && (
        <CaseOpening
          phase={caseOpen.phase}
          won={caseOpen.won}
          onClose={closeCase}
          chestImg={image}
        />
      )}
      
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo">$GLDCHST</span>
          <div className="nav-links">
            <a href="#loot">Loot Rarity</a>
            <a href="#seasons">Season Unlocks</a>
            <button type="button" onClick={openChest} className="nav-cta">Open the Chest</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-burst" aria-hidden="true">
          <div className="burst-ray burst-ray-1" />
          <div className="burst-ray burst-ray-2" />
          <div className="burst-ray burst-ray-3" />
          <div className="burst-ray burst-ray-4" />
          <div className="burst-ray burst-ray-5" />
          <div className="burst-ray burst-ray-6" />
          <div className="burst-ray burst-ray-7" />
          <div className="burst-ray burst-ray-8" />
        </div>
        <div className="hero-glow-ring" />
        <div className="hero-content">
          <p className="hero-badge">LEGENDARY LOOT</p>
          <h1 className="hero-title">
            <span className="hero-title-main">GOLDEN CHEST</span>
            <span className="hero-ticker">$GLDCHST</span>
          </h1>
          <p className="hero-subtitle">
            The memecoin that hits different. Battle-royale energy. 
            <br />Open the chest. Claim your loot.
          </p>
          <button type="button" onClick={openChest} className="hero-cta">
            <span className="hero-cta-text">Open the Chest</span>
            <span className="hero-cta-glow" />
          </button>
        </div>
        <div className="hero-chest">
          <img src={image} alt="Legendary Golden Chest" className="hero-chest-img" />
          <div className="hero-chest-glow" />
        </div>
      </section>

      <section id="loot" className="section loot-section">
        <h2 className="section-title">
          <span className="section-title-icon">📦</span>
          Loot Rarity
        </h2>
        <p className="section-subtitle">Tokenomics as loot tiers. Every holder gets a piece.</p>
        <div className="loot-grid">
          {lootTiers.map((tier) => (
            <div 
              key={tier.name} 
              className="loot-card"
              style={{ '--tier-color': tier.color } as React.CSSProperties}
            >
              <span className="loot-icon">{tier.icon}</span>
              <h3 className="loot-name">{tier.name}</h3>
              <p className="loot-percent">{tier.percent}%</p>
              <p className="loot-desc">{tier.desc}</p>
              <div className="loot-bar">
                <div 
                  className="loot-bar-fill" 
                  style={{ width: `${tier.percent}%`, backgroundColor: tier.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="seasons" className="section seasons-section">
        <h2 className="section-title">
          <span className="section-title-icon">🗺️</span>
          Season Unlocks
        </h2>
        <p className="section-subtitle">The roadmap. Each season unlocks new rewards.</p>
        <div className="seasons-timeline">
          {seasons.map((season) => (
            <div 
              key={season.num} 
              className={`season-card season-${season.status}`}
            >
              <div className="season-header">
                <span className="season-num">S{season.num}</span>
                <h3 className="season-title">{season.title}</h3>
                <span className={`season-badge season-badge-${season.status}`}>
                  {season.status === 'unlocked' ? '✓ Unlocked' : '🔒 Locked'}
                </span>
              </div>
              <ul className="season-items">
                {season.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="cta" className="section cta-section">
        <div className="cta-bg-glow" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to Open the Chest?</h2>
          <p className="cta-subtitle">Join the raid. Claim your legendary loot.</p>
          <button type="button" onClick={openChest} className="cta-button">
            <span>Open the Chest</span>
            <span className="cta-button-glow" />
          </button>
          <p className="cta-ticker">$GLDCHST</p>
        </div>
      </section>
    </>
  )
}

export default App
