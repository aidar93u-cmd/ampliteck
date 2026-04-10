;(function () {
	'use strict'

	var sidebar = document.getElementById('sidebar')
	var burger = document.getElementById('burger')
	var overlay = document.getElementById('sidebarOverlay')
	var SCROLL_THRESH = 800

	/* ---- AOS init — fill empty data-aos with default animation ---- */
	document.querySelectorAll('[data-aos]').forEach(function (el) {
		if (!el.getAttribute('data-aos'))
			el.setAttribute('data-aos', 'fade-zoom-in')
	})
	if (typeof AOS !== 'undefined') {
		AOS.init({ duration: 700, once: true, offset: 80, easing: 'ease-out' })
	}

	/* ---- SVG deco lines draw animation ---- */
	;(function () {
		var DELAYS = [150, 400, 650, 900] // ms stagger per line
		var DURATION = '4.9s'
		var EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

		document.querySelectorAll('.deco-lines').forEach(function (svg) {
			var lines = svg.querySelectorAll('.deco-line')
			lines.forEach(function (line, i) {
				var len = line.getTotalLength()
				line.style.strokeDasharray = len
				line.style.strokeDashoffset = len
				setTimeout(
					function () {
						line.style.transition =
							'stroke-dashoffset ' + DURATION + ' ' + EASING
						line.style.strokeDashoffset = 0
					},
					DELAYS[i] !== undefined ? DELAYS[i] : i * 1250,
				)
			})
		})
	})()

	/* ---- Lenis smooth scroll ---- */
	var lenis
	if (typeof Lenis !== 'undefined') {
		lenis = new Lenis({
			duration: 1.7,
			smoothWheel: true,
			smoothTouch: false,
		})
		function raf(time) {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}
		requestAnimationFrame(raf)
	}

	/* ---- Burger / sidebar open-close ---- */
	function openSidebar() {
		sidebar.classList.add('is-open')
		overlay.classList.add('is-active')
		burger.classList.add('is-active')
		document.body.style.overflow = 'hidden'
	}

	function closeSidebar() {
		sidebar.classList.remove('is-open')
		overlay.classList.remove('is-active')
		burger.classList.remove('is-active')
		document.body.style.overflow = ''
	}

	burger.addEventListener('click', function () {
		if (sidebar.classList.contains('is-open')) {
			closeSidebar()
		} else {
			openSidebar()
		}
	})

	overlay.addEventListener('click', closeSidebar)

	var closeBtn = document.getElementById('sidebarClose')
	if (closeBtn) closeBtn.addEventListener('click', closeSidebar)

	/* Close sidebar on nav link click (mobile) */
	var navLinks = sidebar.querySelectorAll('a')
	navLinks.forEach(function (link) {
		link.addEventListener('click', function () {
			if (window.innerWidth <= 1024) {
				closeSidebar()
			}
		})
	})

	/* ---- Sidebar scroll state (accent → light) ---- */
	function onScroll() {
		if (window.scrollY > SCROLL_THRESH) {
			sidebar.classList.add('sidebar--scrolled')
		} else {
			sidebar.classList.remove('sidebar--scrolled')
		}
	}

	window.addEventListener('scroll', onScroll, { passive: true })
	onScroll()

	/* ---- Active nav link on scroll ---- */
	var sections = document.querySelectorAll('section[id], footer[id]')
	var sidebarAnchors = sidebar.querySelectorAll('a[href^="#"]')

	function setActiveLink() {
		var scrollY = window.scrollY + 120
		var current = ''

		sections.forEach(function (sec) {
			if (sec.offsetTop <= scrollY) {
				current = sec.getAttribute('id')
			}
		})

		sidebarAnchors.forEach(function (a) {
			a.classList.remove('is-active')
			if (a.getAttribute('href') === '#' + current) {
				a.classList.add('is-active')
			}
		})
	}

	window.addEventListener('scroll', setActiveLink, { passive: true })
	setActiveLink()

	/* ---- Slot machine digit roller ---- */
	;(function () {
		var els = document.querySelectorAll('[data-count]')
		if (!els.length) return

		function buildRoller(el) {
			var target = parseInt(el.getAttribute('data-count'), 10)
			var suffix = el.getAttribute('data-suffix') || ''
			var digits = String(target).split('')

			var wrap = document.createElement('span')
			wrap.className = 'roller-wrap'

			var cols = digits.map(function (d) {
				var col = document.createElement('span')
				col.className = 'roller-col'
				var inner = document.createElement('span')
				inner.className = 'roller-col__inner'
				for (var i = 0; i <= 10; i++) {
					var s = document.createElement('span')
					s.textContent = i === 10 ? 0 : i
					inner.appendChild(s)
				}
				col.appendChild(inner)
				wrap.appendChild(col)
				return { inner: inner, digit: parseInt(d, 10) }
			})

			if (suffix) {
				var sfx = document.createElement('span')
				sfx.className = 'roller-suffix'
				sfx.textContent = suffix
				wrap.appendChild(sfx)
			}

			el.textContent = ''
			el.appendChild(wrap)
			return cols
		}

		function spin(cols) {
			cols.forEach(function (col, i) {
				/* Left digits (higher place values) spin slower */
				var delay = (cols.length - 1 - i) * 180
				setTimeout(function () {
					col.inner.style.setProperty(
						'--roller-to',
						col.digit === 0 ? 10 : col.digit,
					)
				}, delay)
			})
		}

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return
					var cols = buildRoller(entry.target)
					requestAnimationFrame(function () {
						requestAnimationFrame(function () {
							spin(cols)
						})
					})
					observer.unobserve(entry.target)
				})
			},
			{ threshold: 0.4 },
		)

		els.forEach(function (el) {
			observer.observe(el)
		})
	})()

	/* ---- Partners slider ---- */
	var partnersRow = document.querySelector('.partners__row')
	if (partnersRow) {
		var items = Array.from(partnersRow.querySelectorAll('.partner-logo'))
		var VISIBLE = 5
		var current = 0
		var total = items.length

		if (total > VISIBLE) {
			/* Create nav buttons */
			var prevBtn = document.createElement('button')
			var nextBtn = document.createElement('button')
			prevBtn.className = 'partners__btn partners__btn--prev'
			nextBtn.className = 'partners__btn partners__btn--next'
			prevBtn.setAttribute('aria-label', 'Назад')
			nextBtn.setAttribute('aria-label', 'Вперёд')
			prevBtn.innerHTML = '&#8592;'
			nextBtn.innerHTML = '&#8594;'

			var wrapper = partnersRow.parentElement
			wrapper.style.position = 'relative'
			wrapper.appendChild(prevBtn)
			wrapper.appendChild(nextBtn)

			function updateSlider() {
				items.forEach(function (item, i) {
					item.style.display =
						i >= current && i < current + VISIBLE ? '' : 'none'
				})
				prevBtn.disabled = current === 0
				nextBtn.disabled = current + VISIBLE >= total
			}

			prevBtn.addEventListener('click', function () {
				if (current > 0) {
					current--
					updateSlider()
				}
			})

			nextBtn.addEventListener('click', function () {
				if (current + VISIBLE < total) {
					current++
					updateSlider()
				}
			})

			updateSlider()
		}
	}

	/* ---- Footer location tabs ---- */
	var footerTop = document.getElementById('footerTop')
	var locationTabs = footerTop
		? footerTop.querySelectorAll('.location-block[data-tab]')
		: []

	if (locationTabs.length) {
		var footerPanels = footerTop
			? footerTop.querySelectorAll('.footer__panel[data-panel]')
			: []

		function switchLocationTab(idx) {
			locationTabs.forEach(function (tab, i) {
				var isActive = i === idx
				tab.classList.toggle('is-active', isActive)
				tab.classList.toggle('location-block--accent', isActive)
				tab.classList.toggle('location-block--dark', !isActive)
				tab.setAttribute('aria-pressed', isActive ? 'true' : 'false')
			})
			footerPanels.forEach(function (panel) {
				panel.style.display = panel.dataset.panel === String(idx) ? '' : 'none'
			})
		}

		locationTabs.forEach(function (tab) {
			tab.addEventListener('click', function () {
				var idx = parseInt(this.dataset.tab, 10)
				if (!this.classList.contains('is-active')) {
					switchLocationTab(idx)
				}
			})
			tab.addEventListener('keydown', function (e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					var idx = parseInt(this.dataset.tab, 10)
					if (!this.classList.contains('is-active')) {
						switchLocationTab(idx)
					}
				}
			})
		})
	}

	/* ---- Sidebar stops at footer ---- */
	var footerEl = document.querySelector('.footer')
	if (footerEl) {
		function updateSidebarPosition() {
			if (window.innerWidth <= 1024) {
				sidebar.style.position = ''
				sidebar.style.top = ''
				return
			}
			var footerTop = footerEl.getBoundingClientRect().top
			var vh = window.innerHeight
			if (footerTop < vh) {
				sidebar.style.position = 'absolute'
				sidebar.style.top = window.scrollY + footerTop - vh + 'px'
			} else {
				sidebar.style.position = ''
				sidebar.style.top = ''
			}
		}
		window.addEventListener('scroll', updateSidebarPosition, { passive: true })
		window.addEventListener('resize', updateSidebarPosition, { passive: true })
		updateSidebarPosition()
	}

	/* ---- Smooth scroll for anchor links ---- */
	document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
		anchor.addEventListener('click', function (e) {
			var target = document.querySelector(this.getAttribute('href'))
			if (target) {
				e.preventDefault()
				var offset = target.getBoundingClientRect().top + window.scrollY - 24
				window.scrollTo({ top: offset, behavior: 'smooth' })
			}
		})
	})

	/* ---- Partners Swiper slider (index.html) ---- */
	if (
		typeof Swiper !== 'undefined' &&
		document.querySelector('.partners-swiper')
	) {
		var partnersSwiper = new Swiper('.partners-swiper', {
			slidesPerView: 5,
			spaceBetween: 0,
			loop: true,
			speed: 900,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: '#partnersNext',
				prevEl: '#partnersPrev',
				disabledClass: 'is-disabled',
			},
			breakpoints: {
				0: { slidesPerView: 1.6 },
				480: { slidesPerView: 3 },
				768: { slidesPerView: 4 },
				1024: { slidesPerView: 5 },
			},
		})
	}

	/* ---- Partners custom carousel (about.html) ---- */
	var pPrev = document.getElementById('partnersPrev')
	var pNext = document.getElementById('partnersNext')
	var pTrack = document.getElementById('partnersTrack')

	if (pPrev && pNext && pTrack) {
		var pLogos = pTrack.querySelectorAll('.partners__logo')
		var pVisible = 5
		var pCurrent = 0
		var pTotal = pLogos.length

		function updatePartnersTrack() {
			var logoW = pLogos[0] ? pLogos[0].offsetWidth : 0
			pTrack.style.transform = 'translateX(' + -pCurrent * logoW + 'px)'
			pPrev.classList.toggle('is-disabled', pCurrent === 0)
			pNext.classList.toggle('is-disabled', pCurrent + pVisible >= pTotal)
		}

		pPrev.addEventListener('click', function () {
			if (pCurrent > 0) {
				pCurrent--
				updatePartnersTrack()
			}
		})
		pNext.addEventListener('click', function () {
			if (pCurrent + pVisible < pTotal) {
				pCurrent++
				updatePartnersTrack()
			}
		})

		updatePartnersTrack()
		window.addEventListener('resize', updatePartnersTrack, { passive: true })
	}

	/* ---- Timeline Swiper (about.html) ---- */
	if (
		typeof Swiper !== 'undefined' &&
		document.querySelector('#timelineSwiper')
	) {
		var timelineSwiper = new Swiper('#timelineSwiper', {
			slidesPerView: 3,
			spaceBetween: 0,
			grabCursor: true,
			on: {
				slideChange: function () {
					syncTimeline(this.activeIndex)
				},
			},

			breakpoints: {
				0: { slidesPerView: 1.1 },
				480: { slidesPerView: 3 },
			},
		})

		function syncTimeline(activeIndex) {
			// Update slide active state
			document.querySelectorAll('.timeline__item').forEach(function (item, i) {
				item.classList.toggle('is-active', i === activeIndex)
			})
			// Update year nav buttons
			var yearBtns = document.querySelectorAll('.timeline__year-btn')
			yearBtns.forEach(function (btn, i) {
				btn.classList.toggle('is-active', i === activeIndex)
			})
			// Scroll year nav to keep active button visible
			var nav = document.getElementById('timelineYearsNav')
			var activeBtn = yearBtns[activeIndex]
			if (nav && activeBtn) {
				var btnLeft = activeBtn.offsetLeft
				var btnWidth = activeBtn.offsetWidth
				var navWidth = nav.offsetWidth
				nav.scrollTo({
					left: btnLeft - navWidth / 2 + btnWidth / 2,
					behavior: 'smooth',
				})
			}
		}

		document.querySelectorAll('.timeline__year-btn').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var idx = parseInt(this.dataset.index, 10)
				timelineSwiper.slideTo(idx)
				syncTimeline(idx)
			})
		})

		// Click on slide to make it active
		document.querySelectorAll('.timeline__item').forEach(function (item, i) {
			item.addEventListener('click', function () {
				timelineSwiper.slideTo(i)
				syncTimeline(i)
			})
		})
	}

	/* ---- Services show more (index.html, mobile) ---- */
	;(function () {
		var btn = document.querySelector('.services__show-more')
		var list = document.querySelector('.services__list')
		if (!btn || !list) return
		btn.addEventListener('click', function () {
			list.classList.add('is-expanded')
			btn.classList.add('is-hidden')
		})
	})()

	/* ---- News load more (news.html) ---- */
	;(function () {
		'use strict'
		var moreBtn = document.getElementById('newsMore')
		if (moreBtn) {
			moreBtn.addEventListener('click', function () {
				// Placeholder: load more news via AJAX or pagination
			})
		}
	})()

	/* ---- Gallery & related projects (project-detail.html) ---- */
	;(function () {
		'use strict'

		/* ---- Gallery Swiper ---- */
		if (document.getElementById('gallerySwiper')) {
			new Swiper('#gallerySwiper', {
				slidesPerView: 1.1,
				spaceBetween: 30,
				navigation: {
					prevEl: '#galleryPrev',
					nextEl: '#galleryNext',
					disabledClass: 'swiper-button-disabled',
				},

				breakpoints: {
					0: { slidesPerView: 1.3, spaceBetween: 10 },
					1024: { slidesPerView: 1.1, spaceBetween: 30 },
				},
			})

			/* zoom-out on gallery links when visible */
			var galleryLinks = document.querySelectorAll('.project-gallery__link')
			if (galleryLinks.length && 'IntersectionObserver' in window) {
				var galleryObs = new IntersectionObserver(
					function (entries) {
						entries.forEach(function (entry) {
							if (entry.isIntersecting) {
								entry.target.classList.add('is-zoomed')
								galleryObs.unobserve(entry.target)
							}
						})
					},
					{ threshold: 0.15 },
				)
				galleryLinks.forEach(function (el) {
					galleryObs.observe(el)
				})
			}

			/* Fancybox for gallery */
			if (typeof Fancybox !== 'undefined') {
				Fancybox.bind('[data-fancybox="gallery"]', {
					Toolbar: {
						display: {
							left: [],
							middle: ['prev', 'counter', 'next'],
							right: ['close'],
						},
					},
					Images: { zoom: true },
				})
			}
		}

		/* ---- Related projects Swiper ---- */
		if (document.getElementById('relatedSwiper')) {
			new Swiper('#relatedSwiper', {
				slidesPerView: 1,
				spaceBetween: 0,
				navigation: {
					prevEl: '#relatedPrev',
					nextEl: '#relatedNext',
					disabledClass: 'swiper-button-disabled',
				},
				breakpoints: {
					0: { slidesPerView: 1.1 },
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 3 },
				},
			})
		}

		/* ---- Post related Swiper ---- */
		if (document.getElementById('postRelatedSwiper')) {
			new Swiper('#postRelatedSwiper', {
				slidesPerView: 1.4,
				spaceBetween: 0,
				navigation: {
					prevEl: '#postRelatedPrev',
					nextEl: '#postRelatedNext',
					disabledClass: 'swiper-button-disabled',
				},
				breakpoints: {
					768: { slidesPerView: 2, spaceBetween: 0 },
				},
			})
		}
	})()

	/* ---- Service detail page (service-detail.html) ---- */

	/* Service projects mobile swiper */
	;(function () {
		var el = document.getElementById('svcProjectsSwiper')
		if (!el) return
		var swiper = null
		function initOrDestroy() {
			if (window.innerWidth <= 768) {
				if (!swiper) {
					swiper = new Swiper('#svcProjectsSwiper', {
						slidesPerView: 1.2,
						spaceBetween: 0,
						allowTouchMove: true,
					})
				}
			} else {
				if (swiper) {
					swiper.destroy(true, true)
					swiper = null
				}
			}
		}
		initOrDestroy()
		window.addEventListener('resize', initOrDestroy)
	})()

	/* Checkbox toggle */
	;(function () {
		var consent = document.getElementById('ctaConsent')
		var checkbox = document.getElementById('ctaCheckbox')
		if (consent && checkbox) {
			consent.addEventListener('click', function (e) {
				if (e.target.tagName !== 'A') {
					checkbox.classList.toggle('is-checked')
				}
			})
		}
	})()

	/* ---- CTA Form (service-detail.html + hero modal) ---- */
	;(function () {
		var form =
			document.getElementById('ctaForm') || document.getElementById('heroCta')
		if (!form) return

		var formId = form.id

		/* ── Phone mask ── */
		var phoneInput = document.getElementById(
			formId === 'heroCta' ? 'hm-phone' : 'sf-phone',
		)
		var phoneMask = null
		if (phoneInput && typeof IMask !== 'undefined') {
			phoneMask = IMask(phoneInput, { mask: '+{7} (000) 000-00-00' })
		}

		/* ── Validation rules per field type ── */
		var RULES = {
			name: {
				test: function (v) {
					return v.trim().split(/\s+/).length >= 2
				},
				hint: 'Введите имя и фамилию',
			},
			email: {
				test: function (v) {
					return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
				},
				hint: 'Введите корректный e-mail',
			},
			phone: {
				test: function () {
					return phoneMask
						? phoneMask.unmaskedValue.length === 11
						: phoneInput.value.replace(/\D/g, '').length >= 10
				},
				hint: 'Введите полный номер телефона',
			},
			company: {
				test: function (v) {
					return v.trim().length >= 2
				},
				hint: 'Введите название компании',
			},
		}

		/* ── Create hint elements ── */
		form
			.querySelectorAll('.cta-form__field[data-validate]')
			.forEach(function (field) {
				var type = field.getAttribute('data-validate')
				var rule = RULES[type]
				if (!rule) return
				var hint = document.createElement('span')
				hint.className = 'cta-form__hint'
				hint.textContent = rule.hint
				var inner = field.querySelector('.cta-form__field_inner')
				if (inner) inner.appendChild(hint)
			})

		/* ── Validate single field, returns true if valid ── */
		function validateField(field) {
			var type = field.getAttribute('data-validate')
			var input = field.querySelector('.cta-form__input, .cta-form__textarea')
			var rule = RULES[type]
			var value = input ? input.value : ''

			var valid = rule ? rule.test(value) : value.trim().length > 0

			if (valid) {
				field.classList.remove('cta-form__field--error')
			} else {
				field.classList.add('cta-form__field--error')
			}
			return valid
		}

		/* ── Floating label + live validation on blur ── */
		form
			.querySelectorAll('.cta-form__input, .cta-form__textarea')
			.forEach(function (el) {
				var label = el.parentElement.querySelector('.cta-form__label')
				var field = el.closest('.cta-form__field')

				el.addEventListener('focus', function () {
					if (label) label.style.opacity = '0'
				})

				el.addEventListener('blur', function () {
					/* show label again if field is empty */
					var isEmpty =
						el === phoneInput
							? !phoneMask || !phoneMask.unmaskedValue
							: !el.value.trim()
					if (label && isEmpty) label.style.opacity = ''

					/* validate on blur only if field was touched */
					if (field && field.hasAttribute('data-validate')) {
						validateField(field)
					}
					/* clear global error */
					var msg = document.getElementById(
						formId === 'heroCta' ? 'hmErrorMsg' : 'ctaErrorMsg',
					)
					if (msg) msg.textContent = ''
				})

				el.addEventListener('input', function () {
					if (label) label.style.opacity = '0'
					/* clear error state while typing */
					if (field) field.classList.remove('cta-form__field--error')
					var msg = document.getElementById(
						formId === 'heroCta' ? 'hmErrorMsg' : 'ctaErrorMsg',
					)
					if (msg) msg.textContent = ''
				})
			})

		/* ── File attachment ── */
		var fileInput = document.getElementById('sf-file')
		var fileNameEl = document.getElementById('ctaFileName')
		if (fileInput && fileNameEl) {
			fileInput.addEventListener('change', function () {
				fileNameEl.textContent = this.files.length ? this.files[0].name : ''
			})
		}

		/* ── Toast ── */
		var toast = document.getElementById(
			formId === 'heroCta' ? 'hmToast' : 'ctaToast',
		)
		var toastClose = document.getElementById(
			formId === 'heroCta' ? 'hmToastClose' : 'ctaToastClose',
		)
		if (toastClose) {
			toastClose.addEventListener('click', function () {
				toast.classList.remove('is-visible')
			})
		}

		/* ── Submit ── */
		form.addEventListener('submit', function (e) {
			e.preventDefault()
			var errorMsg = document.getElementById(
				formId === 'heroCta' ? 'hmErrorMsg' : 'ctaErrorMsg',
			)
			var allValid = true

			form
				.querySelectorAll('.cta-form__field[data-required]')
				.forEach(function (field) {
					if (!validateField(field)) allValid = false
				})

			if (!allValid) {
				if (errorMsg) errorMsg.textContent = 'Заполните все обязательные поля'
				/* scroll to first error */
				var first = form.querySelector('.cta-form__field--error')
				if (first) first.querySelector('input, textarea').focus()
				return
			}

			if (errorMsg) errorMsg.textContent = ''
			if (toast) toast.classList.add('is-visible')

			/* reset */
			form.reset()
			if (phoneMask) phoneMask.unmaskedValue = ''
			var fileNameEl = document.getElementById(
				formId === 'heroCta' ? null : 'ctaFileName',
			)
			if (fileNameEl) fileNameEl.textContent = ''
			form.querySelectorAll('.cta-form__label').forEach(function (l) {
				l.style.opacity = ''
			})
			form.querySelectorAll('.cta-form__field').forEach(function (f) {
				f.classList.remove('cta-form__field--error')
			})
		})

		/* ── Consent checkbox visual (hero modal) ── */
		if (formId === 'heroCta') {
			var consent = document.getElementById('hmConsent')
			var checkbox = document.getElementById('hmCheckbox')
			if (consent && checkbox) {
				consent.addEventListener('click', function (e) {
					if (e.target.tagName !== 'A') {
						checkbox.classList.toggle('is-checked')
					}
				})
			}
		}
	})()

	/* Smooth scroll for hero CTA button */
	;(function () {
		var btn = document.querySelector('.service-hero__btn')
		if (!btn) return
		btn.addEventListener('click', function (e) {
			var target = document.getElementById('cta')
			if (target) {
				e.preventDefault()
				target.scrollIntoView({ behavior: 'smooth' })
			}
		})
	})()

	/* ---- Vacancy accordion (career.html) ---- */
	;(function () {
		'use strict'

		var vacancyItems = document.querySelectorAll('.vacancy-item')
		if (!vacancyItems.length) return

		vacancyItems.forEach(function (item) {
			var header = item.querySelector('.vacancy-item__header')
			var body = item.querySelector('.vacancy-item__body')
			if (!header || !body) return

			header.addEventListener('click', function () {
				var isOpen = item.classList.contains('is-open')

				// Close all
				vacancyItems.forEach(function (v) {
					var b = v.querySelector('.vacancy-item__body')
					v.classList.remove('is-open')
					if (b) {
						b.style.maxHeight = '0'
						b.style.opacity = '0'
					}
				})

				// Open clicked
				if (!isOpen) {
					item.classList.add('is-open')
					body.style.maxHeight = body.scrollHeight + 'px'
					body.style.opacity = '1'
				}
			})
		})

		/* ---- Form checkbox visual ---- */
		var checkbox = document.querySelector(
			'.career-form__checkbox input[type="checkbox"]',
		)
		var checkIcon = document.querySelector('.career-form__check-icon')
		if (checkbox && checkIcon) {
			checkbox.addEventListener('change', function () {
				checkIcon.style.display = this.checked ? 'block' : 'none'
			})
		}

		/* ---- Form submit ---- */
		var careerForm = document.getElementById('careerForm')
		if (careerForm) {
			careerForm.addEventListener('submit', function (e) {
				e.preventDefault()
				var btn = careerForm.querySelector('.career-form__submit')
				if (btn) {
					btn.textContent = 'Отправлено ✓'
					btn.disabled = true
					btn.style.opacity = '0.6'
				}
			})
		}
	})()

	/* ---- Certs Swiper (about.html) ---- */
	if (
		typeof Swiper !== 'undefined' &&
		document.querySelector('.certs-swiper')
	) {
		new Swiper('.certs-swiper', {
			slidesPerView: 3,
			spaceBetween: 0,
			loop: true,
			navigation: {
				nextEl: '#certNext',
				prevEl: '#certPrev',
			},
			breakpoints: {
				0: { slidesPerView: 1.5, loop: false },
				769: { slidesPerView: 3, loop: true },
			},
		})
	}

	/* ---- Team swiper (about.html, mobile only) ---- */
	if (typeof Swiper !== 'undefined' && document.querySelector('.team-swiper')) {
		var teamSwiper = new Swiper('.team-swiper', {
			slidesPerView: 1.5,
			spaceBetween: 0,
			breakpoints: {
				769: { enabled: false, slidesPerView: 3 },
			},
		})
	}

	/* ---- Fancybox (about.html certs gallery) ---- */
	if (typeof Fancybox !== 'undefined') {
		Fancybox.bind('[data-fancybox]', {
			Toolbar: {
				display: {
					left: [],
					middle: ['counter'],
					right: ['close'],
				},
			},
		})
		Fancybox.bind('[data-fancybox="certs"]', {
			Toolbar: {
				display: {
					left: [],
					middle: ['prev', 'counter', 'next'],
					right: ['close'],
				},
			},
			Images: {
				zoom: true,
			},
		})
	}

	/* ---- Projects filter (projects.html) ---- */
	;(function () {
		var filterBar = document.getElementById('projFilter')
		if (!filterBar) return

		var groups = filterBar.querySelectorAll('.proj-filter__group')
		var cards = document.querySelectorAll('.projects__grid .case-card')

		/* Group → data attribute map */
		var groupAttr = {
			objects: 'industry',
			services: 'services',
			industries: 'geo',
		}

		/* --- Filter logic --- */
		function getChecked() {
			var active = {}
			groups.forEach(function (g) {
				var key = g.getAttribute('data-filter-group')
				var vals = Array.from(g.querySelectorAll('input:checked')).map(
					function (cb) {
						return cb.value
					},
				)
				if (vals.length) active[key] = vals
			})
			return active
		}

		function applyFilter() {
			var active = getChecked()
			var total = 0
			Object.keys(active).forEach(function (k) {
				total += active[k].length
			})

			cards.forEach(function (card) {
				var pass = Object.keys(active).every(function (key) {
					var attr = groupAttr[key] || key
					var cardVals = (card.getAttribute('data-' + attr) || '').split(',')
					return active[key].some(function (v) {
						return cardVals.indexOf(v) !== -1
					})
				})
				if (pass) {
					card.style.display = ''
					card.offsetHeight // force reflow
					card.classList.remove('is-hiding')
				} else {
					card.classList.add('is-hiding')
					setTimeout(
						(function (c) {
							return function () {
								if (c.classList.contains('is-hiding')) c.style.display = 'none'
							}
						})(card),
						300,
					)
				}
			})

			updateMobCount(total)
			updateResetCount(total)
		}

		/* --- Badge per group --- */
		function updateBadge(group) {
			var checked = group.querySelectorAll('input:checked').length
			var badge = group.querySelector('.proj-filter__badge')
			if (checked > 0) {
				badge.textContent = '[' + checked + ']'
				badge.style.display = ''
			} else {
				badge.style.display = 'none'
			}
		}

		/* --- Mobile count badge on button --- */
		function updateMobCount(total) {
			var el = document.getElementById('projFilterMobCount')
			if (!el) return
			el.textContent = total > 0 ? '[' + total + ']' : ''
		}

		/* --- Reset button count --- */
		function updateResetCount(total) {
			var el = document.getElementById('projFilterResetCount')
			if (!el) return
			el.textContent = total > 0 ? '[' + total + ']' : ''
		}

		/* --- Desktop: dropdown toggle (close others) --- */
		var isMobile = function () {
			return window.innerWidth <= 768
		}

		groups.forEach(function (group) {
			var btn = group.querySelector('.proj-filter__btn')

			btn.addEventListener('click', function (e) {
				e.stopPropagation()
				if (isMobile()) {
					/* Mobile: accordion toggle */
					group.classList.toggle('is-open')
				} else {
					/* Desktop: dropdown, close others */
					var wasOpen = group.classList.contains('is-open')
					groups.forEach(function (g) {
						g.classList.remove('is-open')
					})
					if (!wasOpen) group.classList.add('is-open')
				}
			})

			group.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
				cb.addEventListener('change', function () {
					updateBadge(group)
					applyFilter()
				})
			})
		})

		/* Close desktop dropdowns on outside click */
		document.addEventListener('click', function () {
			if (!isMobile()) {
				groups.forEach(function (g) {
					g.classList.remove('is-open')
				})
			}
		})
		filterBar.addEventListener('click', function (e) {
			e.stopPropagation()
		})

		/* --- Reset --- */
		function resetAll(closePanel) {
			groups.forEach(function (group) {
				group.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
					cb.checked = false
				})
				updateBadge(group)
			})
			cards.forEach(function (card) {
				card.style.display = ''
				card.classList.remove('is-hiding')
			})
			updateMobCount(0)
			updateResetCount(0)
			if (closePanel) closeMobPanel()
		}

		var resetBtn = document.getElementById('projFilterReset')
		if (resetBtn) {
			resetBtn.addEventListener('click', function () {
				resetAll(true)
			})
		}

		/* --- Mobile panel open/close --- */
		function closeMobPanel() {
			filterBar.classList.remove('is-mob-open')
			document.body.style.overflow = ''
		}

		var mobBtn = document.getElementById('projFilterMobBtn')
		if (mobBtn) {
			mobBtn.addEventListener('click', function () {
				filterBar.classList.add('is-mob-open')
				document.body.style.overflow = 'hidden'
			})
		}

		var mobClose = document.getElementById('projFilterMobClose')
		if (mobClose) {
			mobClose.addEventListener('click', function () {
				closeMobPanel()
			})
		}
	})()
})()
;(function () {
	/* ---- Parallax gradient triangles ---- */
	;(function () {
		// accent-tri: bottom-left fixed, top-left moves up/down
		var triEls = document.querySelectorAll('.big-btn-cell.accent-tri')
		// accent-tri-right: bottom-right fixed, top-right moves up/down
		var triRightEls = document.querySelectorAll('.accent-tri-right')

		if (!triEls.length && !triRightEls.length) return

		var FACTOR = 0.18

		function updateParallax() {
			triEls.forEach(function (el) {
				var rect = el.getBoundingClientRect()
				// progress: 0 when bottom of viewport, 1 when top
				var progress =
					(window.innerHeight - rect.top) / (window.innerHeight + rect.height)
				var offset = (progress - 0.5) * rect.height * FACTOR * 2
				el.style.setProperty('--parallax-tri-y', (-offset).toFixed(2) + 'px')
			})
			triRightEls.forEach(function (el) {
				var rect = el.getBoundingClientRect()
				var progress =
					(window.innerHeight - rect.top) / (window.innerHeight + rect.height)
				var offset = (progress - 0.5) * rect.height * FACTOR * 2
				el.style.setProperty(
					'--parallax-tri-right-y',
					(-offset).toFixed(2) + 'px',
				)
			})
		}

		window.addEventListener('scroll', updateParallax, { passive: true })
		window.addEventListener('resize', updateParallax, { passive: true })
		updateParallax()
	})()

	/* ---- Industries accordion (industries.html) ---- */
	var items = document.querySelectorAll('.ind-accordion__item')
	if (!items.length) return

	items.forEach(function (item) {
		var header = item.querySelector('.ind-accordion__header')
		var body = item.querySelector('.ind-accordion__body')
		if (!header || !body) return

		body.style.overflow = 'hidden'
		body.style.transition = 'max-height 0.4s ease, opacity 0.4s ease'

		if (item.classList.contains('ind-accordion__item--open')) {
			body.style.maxHeight = body.scrollHeight + 'px'
			body.style.opacity = '1'
		} else {
			body.style.maxHeight = '0'
			body.style.opacity = '0'
		}

		function openBody() {
			body.style.maxHeight = body.scrollHeight + 'px'
			body.style.opacity = '1'
		}

		header.addEventListener('click', function () {
			var isOpen = item.classList.contains('ind-accordion__item--open')

			items.forEach(function (i) {
				var iBody = i.querySelector('.ind-accordion__body')
				i.classList.remove('ind-accordion__item--open')
				if (iBody) {
					iBody.style.maxHeight = '0'
					iBody.style.opacity = '0'
				}
			})

			if (!isOpen) {
				item.classList.add('ind-accordion__item--open')
				requestAnimationFrame(function () {
					requestAnimationFrame(openBody)
				})
			}
		})
	})
})()
document.addEventListener('DOMContentLoaded', () => {
	const elements = document.querySelectorAll('.reveal-text')

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return

				const el = entry.target

				const duration = el.getAttribute('duration')
				const delay = el.getAttribute('delay')
				const ease = el.getAttribute('ease')
				const direction = el.getAttribute('direction')

				if (duration) el.style.setProperty('--rt-duration', duration)
				if (delay) el.style.setProperty('--rt-delay', delay)
				if (ease) el.style.setProperty('--rt-ease', ease)
				if (direction) el.style.setProperty('--rt-direction', direction)

				// force browser to apply styles BEFORE animation
				requestAnimationFrame(() => {
					el.classList.add('is-visible')
				})

				obs.unobserve(el)
			})
		},
		{ threshold: 0.25 },
	)

	elements.forEach(el => observer.observe(el))
})

// bg-zoom-out for sections with background image/video
document.addEventListener('DOMContentLoaded', () => {
	const bgZooms = document.querySelectorAll('.js-bg-zoom')
	if (!bgZooms.length) return
	const zo = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return
				entry.target.classList.add('is-zoomed')
				obs.unobserve(entry.target)
			})
		},
		{ threshold: 0.1 },
	)
	bgZooms.forEach(el => zo.observe(el))
})
