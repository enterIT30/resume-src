if (document.querySelector('.skills-card') && window.screen.width < 768) {
  new Swiper('.skills-card', {
    observer: true,
    observeParents: true,
    // SLIDES ==================================================================================
    slidesPerView: 1,
    spaceBetween: 10,
    slidesPerGroup: 1,
    watchOverflow: true,
    speed: 800,              //? скорость прокрутки
    //loop: true,
    parallax: true,
    freeMode: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    // УПРАВЛЕНИЕ ==================================================================================
    simulateTouch: true,
    touchRatio: 1,
    toushAngle: 45,
    grabCursor: true,

    // клавиатурой
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Скроллбар
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true, // возможность перетаскивать ползунок
    },

    // BREAKPOINTS ==================================================================================
    breakpoints: {
      320: {
        slidesPerView: 3,
      },
      400: {
        slidesPerView: 4,
      },
      700: {
        slidesPerView: 5,
      },
      768: {
        slidesPerView: 0,
      },
    },
  });
}
