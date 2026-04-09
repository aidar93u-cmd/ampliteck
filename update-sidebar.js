const fs = require('fs')

const OLD = `\t\t<aside class="sidebar" id="sidebar">
\t\t\t<div class="sidebar__content">
\t\t\t\t<a href="/" class="sidebar__logo" aria-label="АМПЛИТЕК">
\t\t\t\t\t<img src="img/logo.svg" />
\t\t\t\t</a>
\t\t\t\t<nav class="sidebar__nav">
\t\t\t\t\t<a href="about.html">о нас</a>
\t\t\t\t\t<a href="services.html">Услуги</a>
\t\t\t\t\t<a href="projects.html">проекты</a>
\t\t\t\t\t<a href="industries.html">отрасли</a>
\t\t\t\t\t<a href="news.html">новости</a>
\t\t\t\t\t<a href="career.html">карьера</a>
\t\t\t\t\t<a href="contacts.html">контакты</a>
\t\t\t\t</nav>
\t\t\t</div>
\t\t\t<div class="sidebar__contacts">
\t\t\t\t<a href="tel:+78552473999">(8552) 473-999</a>
\t\t\t\t<a href="mailto:info@prpv.ru">info@prpv.ru</a>
\t\t\t</div>
\t\t</aside>`

const NEW = `\t\t<aside class="sidebar" id="sidebar">
\t\t\t<!-- Mobile header -->
\t\t\t<div class="sidebar__mob-header">
\t\t\t\t<a href="/" class="sidebar__mob-logo" aria-label="АМПЛИТЕК">
\t\t\t\t\t<img src="img/logo-mobile.svg" alt="АМПЛИТЕК" />
\t\t\t\t</a>
\t\t\t\t<button class="sidebar__close" id="sidebarClose" aria-label="Закрыть">
\t\t\t\t\t<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L17 17M17 1L1 17" stroke="#2C2C2C" stroke-width="1.5" stroke-linecap="round"/></svg>
\t\t\t\t</button>
\t\t\t</div>
\t\t\t<!-- Desktop + mobile nav -->
\t\t\t<div class="sidebar__content">
\t\t\t\t<a href="/" class="sidebar__logo" aria-label="АМПЛИТЕК">
\t\t\t\t\t<img src="img/logo.svg" />
\t\t\t\t</a>
\t\t\t\t<nav class="sidebar__nav">
\t\t\t\t\t<a href="about.html">о нас</a>
\t\t\t\t\t<a href="services.html">Услуги</a>
\t\t\t\t\t<a href="projects.html">проекты</a>
\t\t\t\t\t<a href="industries.html">отрасли</a>
\t\t\t\t\t<a href="news.html">новости</a>
\t\t\t\t\t<a href="career.html">карьера</a>
\t\t\t\t\t<a href="contacts.html">контакты</a>
\t\t\t\t</nav>
\t\t\t</div>
\t\t\t<!-- Desktop contacts -->
\t\t\t<div class="sidebar__contacts">
\t\t\t\t<a href="tel:+78552473999">(8552) 473-999</a>
\t\t\t\t<a href="mailto:info@prpv.ru">info@prpv.ru</a>
\t\t\t</div>
\t\t\t<!-- Mobile footer -->
\t\t\t<div class="sidebar__mob-footer">
\t\t\t\t<div class="sidebar__mob-depts">
\t\t\t\t\t<div class="sidebar__mob-dept">
\t\t\t\t\t\t<span class="label">[ Сервисный отдел ]</span>
\t\t\t\t\t\t<a href="mailto:support@prpv.ru">support@prpv.ru</a>
\t\t\t\t\t\t<a href="tel:+78552473957">(8552) 473-999 (доб. 957)</a>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="sidebar__mob-dept">
\t\t\t\t\t\t<span class="label">[ Отдел продаж ]</span>
\t\t\t\t\t\t<a href="tel:+78552473961">(8552) 473-999 (доб. 961)</a>
\t\t\t\t\t</div>
\t\t\t\t\t<div class="sidebar__mob-dept">
\t\t\t\t\t\t<span class="label">[ Отдел по работе с персоналом ]</span>
\t\t\t\t\t\t<a href="mailto:hr@prpv.ru">hr@prpv.ru</a>
\t\t\t\t\t\t<a href="tel:+79274475111">+7 927 447-51-11</a>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t\t<div class="sidebar__mob-socials">
\t\t\t\t\t<a href="#" class="sidebar__mob-social" aria-label="Telegram"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17" fill="none"><path opacity="0.6" d="M19.9362 1.51976L16.9062 15.7048C16.6802 16.7038 16.1002 16.9288 15.2622 16.4778L10.7172 13.1258L8.49216 15.2528C8.26716 15.4788 8.04116 15.7048 7.52516 15.7048L7.88016 11.0298L16.3582 3.32576C16.7122 2.97076 16.2612 2.84176 15.8102 3.13276L5.26916 9.77276L0.723157 8.38676C-0.275843 8.06476 -0.275843 7.38676 0.949157 6.93676L18.6142 0.0697602C19.4842 -0.18824 20.2262 0.26376 19.9362 1.51976Z" fill="#2C2C2C"/></svg></a>
\t\t\t\t\t<a href="#" class="sidebar__mob-social" aria-label="VK"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="14" viewBox="0 0 24 14" fill="none"><path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd" d="M23.45 0.948C23.616 0.402 23.45 0 22.655 0H20.03C19.362 0 19.054 0.347 18.887 0.73C18.887 0.73 17.552 3.926 15.661 6.002C15.049 6.604 14.771 6.795 14.437 6.795C14.27 6.795 14.019 6.604 14.019 6.057V0.948C14.019 0.292 13.835 0 13.279 0H9.151C8.734 0 8.483 0.304 8.483 0.593C8.483 1.214 9.429 1.358 9.526 3.106V6.904C9.526 7.737 9.373 7.888 9.039 7.888C8.149 7.888 5.984 4.677 4.699 1.003C4.45 0.288 4.198 0 3.527 0H0.9C0.15 0 0 0.347 0 0.73C0 1.412 0.89 4.8 4.145 9.281C6.315 12.341 9.37 14 12.153 14C13.822 14 14.028 13.632 14.028 12.997V10.684C14.028 9.947 14.186 9.8 14.715 9.8C15.105 9.8 15.772 9.992 17.33 11.467C19.11 13.216 19.403 14 20.405 14H23.03C23.78 14 24.156 13.632 23.94 12.904C23.702 12.18 22.852 11.129 21.725 9.882C21.113 9.172 20.195 8.407 19.916 8.024C19.527 7.533 19.638 7.314 19.916 6.877C19.916 6.877 23.116 2.451 23.449 0.948" fill="#2C2C2C"/></svg></a>
\t\t\t\t\t<a href="#" class="sidebar__mob-social" aria-label="Rutube"><svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.6" d="M11.1072 6.36077H3.30772V3.08736H11.1072C11.5628 3.08736 11.8796 3.17159 12.0386 3.31866C12.1975 3.46574 12.296 3.73853 12.296 4.13702V5.31239C12.296 5.73224 12.1975 6.00502 12.0386 6.15211C11.8796 6.29917 11.5628 6.36205 11.1072 6.36205V6.36077ZM11.6423 0.0012518H0V14H3.30772V9.44563H9.40354L12.296 14H16L12.8109 9.42427C13.9867 9.23947 14.5146 8.85731 14.95 8.22752C15.3854 7.59774 15.6038 6.59082 15.6038 5.24701V4.19737C15.6038 3.40037 15.5242 2.77058 15.3854 2.28788C15.2466 1.80515 15.0094 1.3853 14.6724 1.00817C14.3165 0.65117 13.9202 0.399743 13.4445 0.231297C12.9687 0.0842335 12.3743 0 11.6423 0V0.0012518Z" fill="#2C2C2C"/></svg></a>
\t\t\t\t\t<a href="#" class="sidebar__mob-social" aria-label="YouTube"><svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.6" fill-rule="evenodd" clip-rule="evenodd" d="M7.935 9.58282V3.98919L13.338 6.79596L7.935 9.58282ZM19.8 3.02076C19.8 3.02076 19.605 1.64823 19.005 1.04408C18.245 0.251813 17.392 0.247832 17.001 0.201052C14.203 1.33481e-07 10.004 0 10.004 0H9.996C9.996 0 5.798 1.33481e-07 2.999 0.201052C2.608 0.247832 1.756 0.250817 0.995 1.04408C0.395 1.64823 0.2 3.02076 0.2 3.02076C0.2 3.02076 0 4.63117 0 6.24257V7.75245C0 9.36286 0.2 10.9743 0.2 10.9743C0.2 10.9743 0.395 12.3458 0.995 12.95C1.755 13.7432 2.755 13.7173 3.2 13.8009C4.8 13.9532 10 14 10 14C10 14 14.203 13.994 17.001 13.793C17.392 13.7462 18.245 13.7432 19.005 12.95C19.605 12.3458 19.8 10.9743 19.8 10.9743C19.8 10.9743 20 9.36286 20 7.75245V6.24257C20 4.63117 19.8 3.02076 19.8 3.02076Z" fill="#2C2C2C"/></svg></a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</aside>`

const pages = ['index.html','about.html','career.html','industries.html','news.html','post-detail.html','project-detail.html','projects.html','service-detail.html','services.html']
let ok=0, fail=0
pages.forEach(p => {
  let c = fs.readFileSync(p, 'utf8')
  if (c.includes(OLD)) {
    c = c.replace(OLD, NEW)
    fs.writeFileSync(p, c, 'utf8')
    ok++; console.log('OK: '+p)
  } else {
    fail++; console.log('FAIL: '+p)
  }
})
console.log(ok+' ok, '+fail+' fail')
