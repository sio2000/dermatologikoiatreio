const ITEMS = [
  'Αντιγήρανση',
  'Ενέσιμες θεραπείες',
  'Laser Hair Removal',
  'Biofiller',
  'Κλινική δερματολογία',
  'Υαλουρονικό οξύ',
  'Botox',
  'PRP θεραπεία',
  'Μεσοθεραπεία',
] as const

function Track({ suffix }: { suffix: string }) {
  return (
    <>
      {ITEMS.map((label) => (
        <span key={`${suffix}-${label}`}>
          <span className="marquee-item">{label}</span>
          <span className="marquee-dot">◆</span>
        </span>
      ))}
    </>
  )
}

export function Marquee() {
  return (
    <div className="marquee-strip" role="presentation" aria-hidden>
      <div className="marquee-track">
        <Track suffix="a" />
        <Track suffix="b" />
      </div>
    </div>
  )
}
