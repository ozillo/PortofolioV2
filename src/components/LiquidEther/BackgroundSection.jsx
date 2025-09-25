import LiquidEther from './LiquidEther'
import './BackgroundSection.css'

export default function BackgroundSection({
  children,
  height = 600,
  fullScreen = false,     // ⬅️ nuevo
  className = '',
  etherProps = {}
}) {
  const sectionStyle = fullScreen
    ? { minHeight: '100svh' } // puedes usar '100dvh' si prefieres
    : { minHeight: height }

  return (
    <section className={`le-section ${fullScreen ? 'le-section--full' : ''} ${className}`} style={sectionStyle}>
      <div className="le-bg">
        <LiquidEther
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          resolution={0.5}
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          {...etherProps}
        />
      </div>
      <div className="le-content">
        {children}
      </div>
    </section>
  )
}
