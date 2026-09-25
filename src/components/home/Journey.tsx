import { journey } from '@/features/home/content'
import Reveal from '@/components/shared/Reveal'

export default function Journey() {
  return (
    <section className="section journey" aria-labelledby="journey-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="journey-title">Know what comes next.</h2>
          <p>A clear process can take some of the uncertainty out of starting dental care.</p>
        </Reveal>
        <ol className="journey-list">
          {journey.map((step, index) => (
            <li key={step.title}>
              <span className="journey-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
