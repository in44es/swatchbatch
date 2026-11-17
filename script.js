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
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 8px 24px rgba(79, 53, 130, 0.08)'
      header.style.background = 'rgba(244, 241, 251, 0.95)'
    } else {
      header.style.boxShadow = 'none'
      header.style.background = 'rgba(244, 241, 251, 0.85)'
    }
  }, { passive: true })
})
