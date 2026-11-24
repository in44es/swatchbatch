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

  // Shared Contact / Report a Bug Modal
  const CONTACT_EMAIL = 'ines@easy4cc.com'
  const bugButtons = document.querySelectorAll('[data-open-bug-modal]')
  if (bugButtons.length) {
    const dialog = document.createElement('dialog')
    dialog.className = 'atelier-dialog'
    dialog.setAttribute('aria-labelledby', 'atelier-bug-title')
    dialog.innerHTML = `
      <div class="atelier-dialog-inner">
        <div class="atelier-dialog-head">
          <div>
            <div class="eyebrow" style="margin-bottom: 6px;"><span>✦</span> CONTACT &amp; SUPPORT</div>
            <h2 id="atelier-bug-title" style="margin: 0; font-size: 22px; line-height: 1.2;">Report a Bug or Send a Message</h2>
          </div>
          <button type="button" class="atelier-dialog-close" aria-label="Close">×</button>
        </div>
        <p style="margin: 0; font-size: 13.5px; color: var(--muted);">
          Send a message directly to <strong style="color: var(--blue);">${CONTACT_EMAIL}</strong>
          <button type="button" id="bug-copy-email" style="background:none;border:0;color:var(--blue);font-weight:800;cursor:pointer;text-decoration:underline;margin-left:4px;">(Copy email)</button><br>
          Please don&apos;t hesitate to include screenshots — seeing what happened helps me fix issues much faster!
        </p>
        <form id="atelier-bug-form" style="display: grid; gap: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <label class="atelier-form-field">
              Type
              <select id="bug-type">
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Idea">Feature Idea</option>
                <option value="Question">Question / Feedback</option>
              </select>
            </label>
            <label class="atelier-form-field">
              Tool / Page
              <select id="bug-tool">
                <option value="Website">Easy4CC Website</option>
                <option value="EaselEase">EaselEase</option>
                <option value="SwatchBatch">SwatchBatch</option>
                <option value="CareerClimb">CareerClimb</option>
                <option value="MoodletMixer">MoodletMixer</option>
              </select>
            </label>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <label class="atelier-form-field">
              Subject
              <input type="text" id="bug-subject" placeholder="Short summary">
            </label>
            <label class="atelier-form-field">
              Your email (optional)
              <input type="email" id="bug-reply" placeholder="you@example.com">
            </label>
          </div>
          <label class="atelier-form-field">
            Message *
            <textarea id="bug-message" rows="4" required placeholder="Describe what happened or share your feedback..."></textarea>
          </label>
          <div style="padding: 10px 12px; border-radius: 14px; border: 1.5px dashed var(--border-soft); background: #FFFFFF; display: grid; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 12.5px; font-weight: 700; color: var(--ink);">Screenshots (optional — feel free to attach one or more!)</span>
              <button type="button" id="bug-add-files" class="btn btn-secondary" style="min-height: 32px; padding: 4px 12px; font-size: 12px;">+ Add image(s)</button>
              <input type="file" id="bug-files" accept="image/*" multiple style="display: none;">
            </div>
            <div id="bug-previews" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
            <small id="bug-file-note" style="display: none; font-size: 11.5px; color: var(--muted);">Remember to attach these image(s) in your email window before sending.</small>
          </div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
            <button type="submit" class="btn btn-primary">Send Message ✉</button>
            <button type="button" id="bug-copy-msg" class="btn btn-secondary">Copy for Webmail</button>
            <span id="bug-status" style="font-size: 12.5px; font-weight: 800; color: var(--green);"></span>
          </div>
        </form>
      </div>
    `
    document.body.appendChild(dialog)

    const closeBtn = dialog.querySelector('.atelier-dialog-close')
    const form = dialog.querySelector('#atelier-bug-form')
    const fileInput = dialog.querySelector('#bug-files')
    const addFilesBtn = dialog.querySelector('#bug-add-files')
    const previews = dialog.querySelector('#bug-previews')
    const fileNote = dialog.querySelector('#bug-file-note')
    const statusEl = dialog.querySelector('#bug-status')
    let attachedFiles = []

    const renderPreviews = () => {
      previews.innerHTML = ''
      fileNote.style.display = attachedFiles.length ? 'block' : 'none'
      attachedFiles.forEach((item, idx) => {
        const wrap = document.createElement('div')
        wrap.style.cssText = 'position:relative;width:68px;height:52px;border-radius:10px;overflow:hidden;border:1.5px solid var(--border-soft);'
        wrap.innerHTML = `<img src="${item.url}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">`
        const rm = document.createElement('button')
        rm.type = 'button'
        rm.textContent = '×'
        rm.style.cssText = 'position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:50%;border:0;background:rgba(31,53,80,.85);color:#fff;font-size:11px;cursor:pointer;line-height:1;'
        rm.addEventListener('click', () => {
          URL.revokeObjectURL(item.url)
          attachedFiles.splice(idx, 1)
          renderPreviews()
        })
        wrap.appendChild(rm)
        previews.appendChild(wrap)
      })
    }

    addFilesBtn.addEventListener('click', () => fileInput.click())
    fileInput.addEventListener('change', (e) => {
      Array.from(e.target.files || []).forEach((f) => {
        attachedFiles.push({ name: f.name, url: URL.createObjectURL(f) })
      })
      e.target.value = ''
      renderPreviews()
    })

    const buildBody = () => {
      const type = dialog.querySelector('#bug-type').value
      const tool = dialog.querySelector('#bug-tool').value
      const reply = dialog.querySelector('#bug-reply').value.trim()
      const msg = dialog.querySelector('#bug-message').value.trim()
      return [
        `Type: ${type}`,
        `Tool: ${tool}`,
        reply ? `Reply-to: ${reply}` : null,
        attachedFiles.length ? `Attached screenshots (${attachedFiles.length}): ${attachedFiles.map((f) => f.name).join(', ')}` : null,
        '',
        msg,
      ].filter((x) => x !== null).join('\n')
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const type = dialog.querySelector('#bug-type').value
      const tool = dialog.querySelector('#bug-tool').value
      const subj = dialog.querySelector('#bug-subject').value.trim() || 'Feedback'
      const fullSubj = `[${tool} - ${type}] ${subj}`
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(fullSubj)}&body=${encodeURIComponent(buildBody())}`
    })

    dialog.querySelector('#bug-copy-email').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL)
        statusEl.textContent = '✓ Email copied!'
        setTimeout(() => { statusEl.textContent = '' }, 2200)
      } catch {}
    })

    dialog.querySelector('#bug-copy-msg').addEventListener('click', async () => {
      const type = dialog.querySelector('#bug-type').value
      const tool = dialog.querySelector('#bug-tool').value
      const subj = dialog.querySelector('#bug-subject').value.trim() || 'Feedback'
      try {
        await navigator.clipboard.writeText(`To: ${CONTACT_EMAIL}\nSubject: [${tool} - ${type}] ${subj}\n\n${buildBody()}`)
        statusEl.textContent = '✓ Message copied!'
        setTimeout(() => { statusEl.textContent = '' }, 2200)
      } catch {}
    })

    closeBtn.addEventListener('click', () => dialog.close())
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close() })
    bugButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!dialog.open) dialog.showModal()
      })
    })
  }

  // FAQ Category Tabs
  const faqTabs = Array.from(document.querySelectorAll('.faq-tab[data-faq-tab]'))
  const faqItems = Array.from(document.querySelectorAll('.faq-item[data-faq-category]'))
  const faqPanel = document.getElementById('faq-tabpanel')
  if (faqTabs.length && faqItems.length) {
    const activateFaqTab = (category) => {
      const targetTab = faqTabs.find((tab) => tab.getAttribute('data-faq-tab') === category)
      if (!targetTab) return

      faqTabs.forEach((tab) => {
        const isMatch = tab === targetTab
        tab.classList.toggle('is-active', isMatch)
        tab.setAttribute('aria-selected', isMatch ? 'true' : 'false')
        tab.setAttribute('tabindex', isMatch ? '0' : '-1')
      })

      if (faqPanel && targetTab.id) {
        faqPanel.setAttribute('aria-labelledby', targetTab.id)
      }

      faqItems.forEach((item) => {
        const itemCat = item.getAttribute('data-faq-category')
        item.hidden = category !== 'all' && itemCat !== category
      })
    }

    faqTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        activateFaqTab(tab.getAttribute('data-faq-tab'))
      })

      tab.addEventListener('keydown', (e) => {
        let nextIdx = null
        if (e.key === 'ArrowRight') nextIdx = (idx + 1) % faqTabs.length
        else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + faqTabs.length) % faqTabs.length
        else if (e.key === 'Home') nextIdx = 0
        else if (e.key === 'End') nextIdx = faqTabs.length - 1

        if (nextIdx !== null) {
          e.preventDefault()
          const nextTab = faqTabs[nextIdx]
          activateFaqTab(nextTab.getAttribute('data-faq-tab'))
          nextTab.focus()
        }
      })
    })

    const syncFaqFromHash = () => {
      const hash = window.location.hash
      if (hash && hash.startsWith('#faq-')) {
        const cat = hash.replace('#faq-', '')
        if (faqTabs.some((t) => t.getAttribute('data-faq-tab') === cat)) {
          activateFaqTab(cat)
          return true
        }
      }
      return false
    }

    if (!syncFaqFromHash()) {
      const initialTab = faqTabs.find((t) => t.classList.contains('is-active')) || faqTabs[0]
      activateFaqTab(initialTab.getAttribute('data-faq-tab'))
    }
    window.addEventListener('hashchange', syncFaqFromHash)
  }

  // Embedded itch.io popup checkout for SwatchBatch Full
  const itchBuyButtons = Array.from(document.querySelectorAll('[data-itch-buy]'))
  if (itchBuyButtons.length) {
    const attachItchButtons = () => {
      if (!window.Itch || typeof window.Itch.attachBuyButton !== 'function') return
      itchBuyButtons.forEach((btn) => {
        if (btn.dataset.itchAttached) return
        const game = btn.getAttribute('data-itch-buy')
        if (!game) return
        btn.dataset.itchAttached = '1'
        window.Itch.attachBuyButton(btn, { user: 'in44es', game })
      })
    }
    if (window.Itch && typeof window.Itch.attachBuyButton === 'function') {
      attachItchButtons()
    } else if (!document.querySelector('script[src="https://static.itch.io/api.js"]')) {
      const itchScript = document.createElement('script')
      itchScript.src = 'https://static.itch.io/api.js'
      itchScript.async = true
      itchScript.addEventListener('load', attachItchButtons)
      document.head.appendChild(itchScript)
    }
  }
})
