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
        header.style.boxShadow = '0 12px 32px rgba(31, 53, 80, 0.12), 0 0 0 1px #CFE3F0'
        header.style.background = 'rgba(255, 255, 255, 0.96)'
      } else {
        header.style.boxShadow = '0 8px 28px rgba(46, 143, 208, 0.09), 0 0 0 1px #CFE3F0'
        header.style.background = 'rgba(255, 255, 255, 0.88)'
      }
    }, { passive: true })
  }

  // Playful "joy bubble" on download / studio CTA clicks
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion) {
    document.querySelectorAll('a[download], .btn-primary, .btn-secondary').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect()
        const x = e.clientX || (rect.left + rect.width / 2)
        const y = e.clientY || rect.top
        const bubble = document.createElement('span')
        bubble.className = 'joy-bubble'
        bubble.textContent = btn.hasAttribute('download') ? '✦ Downloading!' : '✦ Let’s create!'
        bubble.style.left = `${x}px`
        bubble.style.top = `${y - 8}px`
        document.body.appendChild(bubble)
        setTimeout(() => bubble.remove(), 950)
      })
    })
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

  // Interactive Tools Dock + Spotlight Arrows
  const toolTiles = Array.from(document.querySelectorAll('.tool-tile[data-tool]'))
  const toolPanes = Array.from(document.querySelectorAll('.tool-detail-pane[data-tool]'))
  if (toolTiles.length && toolPanes.length) {
    let activeIndex = Math.max(0, toolTiles.findIndex((t) => t.classList.contains('is-active')))

    const activateTool = (toolId) => {
      const nextIndex = toolTiles.findIndex((tile) => tile.getAttribute('data-tool') === toolId)
      if (nextIndex === -1) return
      activeIndex = nextIndex
      toolTiles.forEach((tile, idx) => {
        const isMatch = idx === nextIndex
        tile.classList.toggle('is-active', isMatch)
        tile.setAttribute('aria-selected', isMatch ? 'true' : 'false')
      })
      toolPanes.forEach((pane) => {
        pane.classList.toggle('is-active', pane.getAttribute('data-tool') === toolId)
      })
    }

    toolTiles.forEach((tile) => {
      const toolId = tile.getAttribute('data-tool')
      tile.addEventListener('mouseenter', () => activateTool(toolId))
      tile.addEventListener('focus', () => activateTool(toolId))
      tile.addEventListener('click', () => activateTool(toolId))
    })

    const prevBtn = document.getElementById('spotlight-prev')
    const nextBtn = document.getElementById('spotlight-next')
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const nextIdx = (activeIndex - 1 + toolTiles.length) % toolTiles.length
        activateTool(toolTiles[nextIdx].getAttribute('data-tool'))
      })
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIdx = (activeIndex + 1) % toolTiles.length
        activateTool(toolTiles[nextIdx].getAttribute('data-tool'))
      })
    }

    // Support direct hash links like #tool-careerclimb or #tool-moodletmixer
    const syncFromHash = () => {
      const hash = window.location.hash
      if (hash && hash.startsWith('#tool-')) {
        const toolId = hash.replace('#tool-', '')
        activateTool(toolId)
        const showcase = document.getElementById('tools-showcase')
        if (showcase) {
          showcase.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
  }
})
