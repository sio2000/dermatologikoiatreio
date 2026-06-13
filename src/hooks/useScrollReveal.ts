import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal() {
  useLayoutEffect(() => {
    /**
     * Διαχειριζόμαστε εμείς το scroll restoration. Αλλιώς, όταν ο χρήστης επιστρέφει
     * (back) στην αρχική, ο browser επαναφέρει το παλιό scroll position και το ScrollTrigger
     * υπολογίζει λάθος θέσεις, αφήνοντας τα sections «κρυφά» (opacity 0) — κενή σελίδα.
     */
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const main = document.querySelector('#main-content')
    if (!main) return

    // Ξεκινάμε πάντα από την κορυφή (εκτός αν υπάρχει hash για συγκεκριμένο section).
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(main.querySelectorAll('.fade-up')).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      })
      gsap.utils.toArray<HTMLElement>(main.querySelectorAll('.fade-in')).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      })
    })

    // Επαναϋπολογισμός θέσεων μετά το layout και τη φόρτωση εικόνων.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    /**
     * Δίχτυ ασφαλείας: αν για οποιονδήποτε λόγο μείνει κρυφό κάποιο στοιχείο που βρίσκεται
     * ήδη μέσα ή πάνω από το viewport, το αποκαλύπτουμε ώστε να μην υπάρχει ποτέ κενή σελίδα.
     */
    const safety = window.setTimeout(() => {
      const vh = window.innerHeight
      main.querySelectorAll<HTMLElement>('.fade-up, .fade-in').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < vh && Number(getComputedStyle(el).opacity) < 0.9) {
          gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' })
        }
      })
      ScrollTrigger.refresh()
    }, 1300)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', onLoad)
      window.clearTimeout(safety)
      ctx.revert()
    }
  }, [])
}
