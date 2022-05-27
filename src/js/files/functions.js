//! BURGER-MENU ===================================================================================

const iconMenu = document.querySelector(".icon-menu");
const menuBody = document.querySelector('.menu__body');
const arrowMenu = document.querySelector('.menu__header .arrow');

/* Закрытие по бургеру
  iconMenu.addEventListener('click', () => {
  menuBody.classList.toggle('open-menu');
  iconMenu.classList.toggle('open-menu');
}); */

// Закрытие по крестику
arrowMenu.addEventListener('click', () => {
  menuBody.classList.toggle('open-menu');
  iconMenu.classList.toggle('open-menu');
});

// Закрытие по Escape
document.addEventListener('keydown', e => {
  if (e.code == 'Escape') {
    menuBody.classList.remove('open-menu');
    iconMenu.classList.remove('open-menu');
  }
});

// Закрытие по пустоте
document.addEventListener('click', e => {
  if (e.target.closest('.icon-menu')) {
    menuBody.classList.toggle('open-menu');
    iconMenu.classList.toggle('open-menu');
  } else if (e.target.closest('.menu__body') == null && menuBody.classList.contains('open-menu')) {
    console.log(e.target);
    menuBody.classList.toggle('open-menu');
    iconMenu.classList.toggle('open-menu');
  }
});

//! SPOLLER ==================================================================================

const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	// Получение обычных слойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных спойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение слойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация слойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_spoller-init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_spoller-init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_spoller-active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_spoller-active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_spoller-active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

//! POPUP ==================================================================================

const popup = document.querySelector('.popup.popup-thaks');
const btnClose = document.querySelector('.popup__close');

function popupOpen() {
  popup.classList.add('popup-active');
}
function popupClose() {
  popup.classList.remove('popup-active');
}

btnClose.addEventListener('click', () => {
  popupClose();
});

popup.addEventListener('click', (e) => {
  if (e.target === popup) {
    popupClose();
  }
});

function showModalByScroll() {
  if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
     popupOpen();
    window.removeEventListener('scroll', showModalByScroll);
  }
}

window.addEventListener('scroll', showModalByScroll);

//! GALLERY ==================================================================================

const galleryEl = document.querySelectorAll('[data-gallery]');
const pageOverlay = document.createElement('div');

pageOverlay.classList.add('page__overlay');

galleryEl.forEach((photo) => {
  photo.addEventListener('click', (e) => {
    const card = e.target.closest('.card-photo');
    if (card) {
      disabledScroll();
      document.body.append(pageOverlay);

      const imgBig = document.createElement('picture');

      imgBig.style.cssText = `
        position: absolute;
        top: 0px;
        right: 50%;
        transform: translateX(50%);
        width: 90%;
        max-width: 1240px;
        display: flex;
      `;

      imgBig.innerHTML = `

        <img src="${card.dataset.fullImage}.jpg" alt="">
      `;
      pageOverlay.append(imgBig);
    }
    });
});
/* ${title.textContent} */
        /* <source srcset="${card.dataset.fullImage}.avif" type="image/avif">
        <source srcset="${card.dataset.fullImage}.webp" type="image/webp"> */
pageOverlay.addEventListener('click', (e) => {
  enabledScroll();
  pageOverlay.remove();
  pageOverlay.textContent = ''; // очистить page__overlay
});

function disabledScroll() {
  document.body.scrollPosition = window.scrollY;// создание св-ва эл-та body

  document.body.style.cssText =`
    overflow: hidden;
    top: -${document.body.scrollPosition}px; //!!!
    left: 0;
    height: 100vh;
    `;
}

function enabledScroll() {
  document.body.style.cssText = 'position: relative';
  window.scroll({top: document.body.scrollPosition}); //!!!
}

//! HEADER, ПОСЛЕ ПРОКРУТКИ ГЛАВНОЙ СТРАНИЦЫ

window.addEventListener('scroll', () => {
  const mainPage = document.querySelector('.main-page');
  const headerElement = document.querySelector('header.header');

  const mainPageHeight = mainPage.scrollHeight;
  const screenHeight = window.screen.height;
  if (window.pageYOffset >= mainPageHeight) {
    headerElement.classList.add('_fix');
  } else {
    headerElement.classList.remove('_fix');
  }
});

//! ПРОКРУТКА ПРИ КЛИКЕ

const menuLinks = document.querySelectorAll('[data-goto]');

if (menuLinks.length > 0) {
  menuLinks.forEach(menuLink => {
    menuLink.addEventListener('click', onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const menuLink = e.target;
    console.log(menuLink.dataset.goto);

    if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      console.log(gotoBlock);
      const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;
      console.log(gotoBlockValue);
      if (iconMenu.classList.contains('open-menu')) {
        iconMenu.classList.remove('open-menu');
        menuBody.classList.remove('open-menu');
      }

      window.scrollTo({
        top: gotoBlockValue,
        behavior: 'smooth'
      });
      e.preventDefault();
    }
  }
}

