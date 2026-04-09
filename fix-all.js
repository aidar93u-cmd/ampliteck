const fs = require('fs')
const path = require('path')
const base = 'c:/Users/aidar/Desktop/ampliteck'
const read = f => fs.readFileSync(path.join(base, f), 'utf8')
const write = (f, c) => fs.writeFileSync(path.join(base, f), c, 'utf8')

// ─── TASK 1A: CSS ─────────────────────────────────────────────────────────────
;(function() {
  let css = read('css/style.css')

  // 1. Add bg-layer class after js-bg-zoom block
  if (!css.includes('.bg-layer')) {
    css = css.replace(
      '.js-bg-zoom.is-zoomed > img,\n.js-bg-zoom.is-zoomed > video {\n\ttransform: scale(1);\n}',
      '.js-bg-zoom.is-zoomed > img,\n.js-bg-zoom.is-zoomed > video {\n\ttransform: scale(1);\n}\n.bg-layer {\n\tposition: absolute;\n\tinset: 0;\n\twidth: 100%;\n\theight: 100%;\n\tobject-fit: cover;\n\tdisplay: block;\n}'
    )
  }

  // 2. career-benefits__photo: add position:relative + overflow:hidden, remove bg props
  css = css.replace(
    '.career-benefits__photo {\n\tflex: 0 0 50%;\n\tbackground-size: cover;\n\tbackground-position: center top;\n}',
    '.career-benefits__photo {\n\tflex: 0 0 50%;\n\tposition: relative;\n\toverflow: hidden;\n}'
  )

  // 3. service-cover: add position:relative + overflow:hidden, remove bg props
  css = css.replace(
    '.service-cover {\n\theight: 630px;\n\tbackground-size: cover;\n\tbackground-position: center;\n\tbackground-repeat: no-repeat;\n}',
    '.service-cover {\n\theight: 630px;\n\tposition: relative;\n\toverflow: hidden;\n}'
  )

  // 4. detail-cover__bg: add overflow:hidden, remove bg props
  css = css.replace(
    '.detail-cover__bg {\n\tposition: absolute;\n\tinset: 0;\n\tbackground-size: cover;\n\tbackground-position: center;\n}',
    '.detail-cover__bg {\n\tposition: absolute;\n\tinset: 0;\n\toverflow: hidden;\n}'
  )

  write('css/style.css', css)
  console.log('✓ css/style.css')
})()

// ─── TASK 1B: career.html ────────────────────────────────────────────────────
;(function() {
  let html = read('career.html')
  html = html.replace(
    `\t\t\t\t<div\n\t\t\t\t\tclass="career-benefits__photo js-bg-zoom"\n\t\t\t\t\tstyle="background-image: url('img/career/benefits-photo.jpg')"\n\t\t\t\t></div>`,
    `\t\t\t\t<div class="career-benefits__photo js-bg-zoom">\n\t\t\t\t\t<img class="bg-layer" src="img/career/benefits-photo.jpg" alt="" />\n\t\t\t\t</div>`
  )
  write('career.html', html)
  console.log('✓ career.html bg-layer')
})()

// ─── TASK 1C: service-detail.html ────────────────────────────────────────────
;(function() {
  let html = read('service-detail.html')
  html = html.replace(
    `\t\t\t<div\n\t\t\t\tclass="service-cover js-bg-zoom"\n\t\t\t\tstyle="background-image: url('img/service/service-cover.jpg')"\n\t\t\t></div>`,
    `\t\t\t<div class="service-cover js-bg-zoom">\n\t\t\t\t<img class="bg-layer" src="img/service/service-cover.jpg" alt="" />\n\t\t\t</div>`
  )
  write('service-detail.html', html)
  console.log('✓ service-detail.html bg-layer')
})()

// ─── TASK 1D: project-detail.html ────────────────────────────────────────────
;(function() {
  let html = read('project-detail.html')
  html = html.replace(
    `\t\t\t\t<div\n\t\t\t\t\tclass="detail-cover__bg js-bg-zoom"\n\t\t\t\t\tstyle="background-image: url('img/project/project-hero.jpg')"\n\t\t\t\t></div>`,
    `\t\t\t\t<div class="detail-cover__bg js-bg-zoom">\n\t\t\t\t\t<img class="bg-layer" src="img/project/project-hero.jpg" alt="" />\n\t\t\t\t</div>`
  )
  write('project-detail.html', html)
  console.log('✓ project-detail.html bg-layer')
})()

// ─── TASK 2: index.html — Fancybox popup on hero button ─────────────────────
;(function() {
  let html = read('index.html')

  // 1. Add fancybox CSS in head (after aos.css)
  if (!html.includes('fancybox.css')) {
    html = html.replace(
      '<link rel="stylesheet" href="css/aos.css" />',
      '<link rel="stylesheet" href="css/aos.css" />\n\t\t<link rel="stylesheet" href="css/fancybox.css" />'
    )
  }

  // 2. Change desktop hero button to open fancybox
  html = html.replace(
    `<a href="#contacts" class="btn hero__btn reveal-text" duration="10s" delay="0s"\n\t\t\t\t\t>Получить консультацию [→]</a\n\t\t\t\t\t>`,
    `<a href="javascript:;" data-fancybox data-src="#hero-cta-modal" class="btn hero__btn reveal-text" duration="10s" delay="0s">Получить консультацию [→]</a>`
  )

  // 3. Change mobile hero button to open fancybox
  html = html.replace(
    '<a href="#contacts" class="btn hero__btn--mob">Получить консультацию [→]</a>',
    '<a href="javascript:;" data-fancybox data-src="#hero-cta-modal" class="btn hero__btn--mob">Получить консультацию [→]</a>'
  )

  // 4. Insert modal html before closing </main>
  const modal = `
\t\t<!-- HERO CTA MODAL -->
\t\t<div id="hero-cta-modal" style="display:none; max-width:960px; width:100%;">
\t\t\t<div class="service-cta service-cta--modal">
\t\t\t\t<div class="service-cta__left accent-tri-right">
\t\t\t\t\t<span class="service-cta__tag">[ консультация ]</span>
\t\t\t\t\t<div class="service-cta__text">
\t\t\t\t\t\t<h2 class="service-cta__headline">Получите консультацию</h2>
\t\t\t\t\t\t<p class="service-cta__desc">
\t\t\t\t\t\t\tОставьте ваши контакты, наши специалисты свяжутся с вами и расскажут о решениях для вашего объекта
\t\t\t\t\t\t</p>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="service-cta__phone-block">
\t\t\t\t\t\t<p class="service-cta__phone-label">Или позвоните нам самостоятельно:</p>
\t\t\t\t\t\t<div class="service-cta__phone-bottom">
\t\t\t\t\t\t\t<div class="service-cta__phone">(8552) 473-999</div>
\t\t\t\t\t\t\t<div class="service-cta__ext">доб. 961</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="service-cta__right">
\t\t\t\t\t<p class="service-cta__form-tag">заполните форму</p>
\t\t\t\t\t<form class="cta-form" id="heroCta" novalidate>
\t\t\t\t\t\t<div class="cta-form__fields">
\t\t\t\t\t\t\t<div class="cta-form__field" data-required data-validate="name">
\t\t\t\t\t\t\t\t<div class="cta-form__field_inner">
\t\t\t\t\t\t\t\t\t<input class="cta-form__input" id="hm-name" type="text" name="name" placeholder=" " autocomplete="name" />
\t\t\t\t\t\t\t\t\t<label class="cta-form__label" for="hm-name">ФИО <span class="cta-form__req">*</span></label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="cta-form__field" data-required data-validate="email">
\t\t\t\t\t\t\t\t<div class="cta-form__field_inner">
\t\t\t\t\t\t\t\t\t<input class="cta-form__input" id="hm-email" type="email" name="email" placeholder=" " autocomplete="email" />
\t\t\t\t\t\t\t\t\t<label class="cta-form__label" for="hm-email">EMAIL <span class="cta-form__req">*</span></label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="cta-form__field" data-required data-validate="phone">
\t\t\t\t\t\t\t\t<div class="cta-form__field_inner">
\t\t\t\t\t\t\t\t\t<input class="cta-form__input" id="hm-phone" type="tel" name="phone" placeholder=" " autocomplete="tel" />
\t\t\t\t\t\t\t\t\t<label class="cta-form__label" for="hm-phone">Телефон <span class="cta-form__req">*</span></label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="cta-form__field" data-validate="company">
\t\t\t\t\t\t\t\t<div class="cta-form__field_inner">
\t\t\t\t\t\t\t\t\t<input class="cta-form__input" id="hm-company" type="text" name="company" placeholder=" " autocomplete="organization" />
\t\t\t\t\t\t\t\t\t<label class="cta-form__label" for="hm-company">Компания</label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t<div class="cta-form__field cta-form__field--full">
\t\t\t\t\t\t\t\t<div class="cta-form__field_inner">
\t\t\t\t\t\t\t\t\t<textarea class="cta-form__textarea" id="hm-comment" name="comment" placeholder=" "></textarea>
\t\t\t\t\t\t\t\t\t<label class="cta-form__label" for="hm-comment">Комментарий</label>
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="cta-form__footer">
\t\t\t\t\t\t\t<label class="cta-form__consent" id="hmConsent">
\t\t\t\t\t\t\t\t<span class="cta-form__checkbox" id="hmCheckbox">
\t\t\t\t\t\t\t\t\t<svg class="cta-form__checkbox-mark" width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
\t\t\t\t\t\t\t\t\t\t<path d="M1 5l3.5 3.5L11 1" stroke="#80F4D5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
\t\t\t\t\t\t\t\t\t</svg>
\t\t\t\t\t\t\t\t</span>
\t\t\t\t\t\t\t\t<span class="cta-form__consent-text">Согласие на обработку персональных данных</span>
\t\t\t\t\t\t\t</label>
\t\t\t\t\t\t\t<button class="cta-form__submit" type="submit" id="hmSubmit">Отправить [→]</button>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="cta-form__error-msg" id="hmErrorMsg"></div>
\t\t\t\t\t</form>
\t\t\t\t\t<div class="cta-toast" id="hmToast" style="display:none;">
\t\t\t\t\t\t<div class="cta-toast__bar"></div>
\t\t\t\t\t\t<p class="cta-toast__text">Спасибо! Ваша заявка успешно оформлена, мы вам перезвоним.</p>
\t\t\t\t\t\t<button class="cta-toast__close" id="hmToastClose" aria-label="Закрыть">×</button>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>`

  html = html.replace('</main>', modal + '\n\t\t</main>')

  // 5. Add fancybox JS + imask before swiper script
  if (!html.includes('fancybox.umd.js')) {
    html = html.replace(
      '<script src="js/lenis.min.js"></script>',
      '<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js"></script>\n\t\t<script src="https://unpkg.com/imask"></script>\n\t\t<script src="js/lenis.min.js"></script>'
    )
  }

  write('index.html', html)
  console.log('✓ index.html fancybox modal')
})()

// ─── TASK 3: industries.html — add case-card__inner + AOS ───────────────────
;(function() {
  let html = read('industries.html')

  // Wrap case-card contents in case-card__inner with AOS
  // Pattern: inside each <a class="case-card">, wrap img-wrap + body in case-card__inner
  // We need to track position within each projects__grid for delays 0/200/400

  // Process each projects__grid section
  // Strategy: find all projects__grid blocks, within each one process case-cards

  let cardIdxInGrid = 0
  let inGrid = false

  // Use a line-by-line approach to track context
  const lines = html.split('\n')
  const result = []
  let depth = 0
  let gridDepth = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Detect projects__grid open
    if (line.includes('class="projects__grid"')) {
      inGrid = true
      cardIdxInGrid = 0
      depth = 0
      result.push(line)
      continue
    }

    if (!inGrid) {
      result.push(line)
      continue
    }

    // Inside grid: detect case-card
    if (line.match(/^\s*<a href="project-detail\.html" class="case-card">$/)) {
      const delay = [0, 200, 400][cardIdxInGrid % 3]
      cardIdxInGrid++
      const indent = line.match(/^(\s*)/)[1]
      result.push(line)
      // Next lines until </a>: collect and wrap
      // Collect: case-card__img-wrap and case-card__body
      result.push(indent + '\t<div class="case-card__inner" data-aos="fade-zoom-in" data-aos-delay="' + delay + '">')
      continue
    }

    // Close case-card: insert closing div before </a>
    if (line.match(/^\s*<\/a>$/) && inGrid) {
      // Check if it's a case-card close (not nested)
      const indent = line.match(/^(\s*)/)[1]
      result.push(indent + '\t</div>')
      result.push(line)
      continue
    }

    // Detect end of grid (big-btn-cell or closing div)
    if (line.includes('class="big-btn-cell accent-tri"') ||
        (line.match(/^\s*<\/div>$/) && cardIdxInGrid > 0)) {
      // Check if this closes the projects__grid
      if (line.includes('</div>') && !line.includes('<')) {
        // Count divs - simple heuristic: close at same indent as the grid
        result.push(line)
        // Check if next significant line shows we've left the grid
        continue
      }
    }

    // Exit grid on closing </div> that matches the grid's indent
    if (line.match(/^\t+<\/div>$/) || line.match(/^\t+<\/section>/)) {
      result.push(line)
      // Simple: stop tracking grid after big-btn-cell is found
      if (line.includes('projects__grid') || false) inGrid = false
      continue
    }

    result.push(line)
  }

  // The above approach is complex. Let's use a simpler regex approach instead.
  // Reset and use regex
  html = read('industries.html')

  // For each projects__grid, process case-cards within it
  // Replace the case-card structure: add case-card__inner wrapper with AOS

  let gridIdx = 0
  html = html.replace(/<div class="projects__grid">([\s\S]*?)<\/div>\n(\s*)<\/div>/g, (fullMatch, gridContent) => {
    gridIdx++
    let cardIdx = 0
    const newContent = gridContent.replace(
      /(<a href="project-detail\.html" class="case-card">)([\s\S]*?)(<\/a>)/g,
      (m, open, inner, close) => {
        const delay = [0, 200, 400][cardIdx % 3]
        cardIdx++
        // Get indent from the open tag
        const indentMatch = open.match(/^(\s*)/)
        return open + '\n\t\t\t\t\t\t<div class="case-card__inner" data-aos="fade-zoom-in" data-aos-delay="' + delay + '">' + inner + '\t\t\t\t\t\t</div>\n\t\t\t\t\t' + close
      }
    )
    return '<div class="projects__grid">' + newContent + '</div>\n'
  })

  write('industries.html', html)
  console.log('✓ industries.html case-card__inner + AOS')
})()

console.log('\nAll done.')
