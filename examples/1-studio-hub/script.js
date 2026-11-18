// SwatchBatch Landing Page Interactions
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for nav anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href')
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          e.preventDefault()
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    })
  })

  // Sticky header blur effect enhancement on scroll
  const header = document.querySelector('.site-header')
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.style.boxShadow = '0 8px 24px rgba(79, 53, 130, 0.08)'
        header.style.background = 'rgba(244, 241, 251, 0.95)'
      } else {
        header.style.boxShadow = 'none'
        header.style.background = 'rgba(244, 241, 251, 0.85)'
      }
    }, { passive: true })
  }

  // Clickable flagship cards navigating to their product page
  document.querySelectorAll('.flagship-card[data-href]').forEach((card) => {
    card.addEventListener('click', (e) => {
      // If the user clicked on an inner button, link, or child of one, don't override its action
      if (e.target.closest('a') || e.target.closest('button')) {
        return
      }
      const targetUrl = card.getAttribute('data-href')
      if (targetUrl) {
        window.location.href = targetUrl
      }
    })

    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a, button')) {
        e.preventDefault()
        const targetUrl = card.getAttribute('data-href')
        if (targetUrl) {
          window.location.href = targetUrl
        }
      }
    })
  })
})
