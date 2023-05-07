'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

window.addEventListener('click', function (e) {
  console.log(e.target);
  console.log(e.target.parentElement);
});

///////////////////////////////////////
// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

const closeModal = function () {
  modal.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Page navigation
// scrolling to elements
btnScrollTo.addEventListener('click', function (e) {
  // OLD SCHOOL
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // NEW SCHOOL
  section1.scrollIntoView({ behavior: 'smooth' });
});

// WITHOUT event delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// WITH event delegation
// 1. add event listener to common parent
// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABBED components
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  const clickedNum = clicked.getAttribute('data-tab');

  // Guard clause
  if (!clicked) return;

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Show related content
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clickedNum}`)
    .classList.add('operations__content--active');
});

// MENU fade animation
const handleOver = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleOver.bind(0.5));

nav.addEventListener('mouseout', handleOver.bind(1));

// // STICKY nav OLDSCHOOL
// const section1Coords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);

//   if (window.scrollY > section1Coords.y) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// STICKY nav NEWSCHOOL
const obsCallBack = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallBack, obsOptions);
//observer.observe(section1);

// jbfaiEWRBFNVILOARNIGLNarfgnaenfgvaiznefbvioanefribg
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,

  // make it RESPONSIVE - pages will be dynamic
  rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);

// jbfaiEWRBFNVILOARNIGLNarfgnaenfgvaiznefbvioanefribg
// ADD TRANSITIONS TO THE SECTIONS
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // If the work is already done, stop observing, so the performance can be kept
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  // FIRST, hide each of them
  section.classList.add('section--hidden');

  // ADD the feature to each of them
  sectionObserver.observe(section);
});

// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // Replace the src attribute w/ data-src
  entry.target.src = entry.target.dataset.src;

  // REMOVE the blur filter ONLY after loading the new picture
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER
const totalSl = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  const slider = document.querySelector('.slider');
  //slider.style.transform = 'scale(0.4) translatex(-500px';
  slider.style.overflow = 'visible';

  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  let curSlide = 0;

  // functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  const nextSlide = function () {
    if (curSlide === slides.length - 1) return;
    curSlide++;
    goToSlide(curSlide);
    activeDot(curSlide);
  };
  const previousSlide = function () {
    if (curSlide === 0) return;
    curSlide--;
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  // starter
  const init = function () {
    goToSlide(0);
    createDots();
    activeDot(0);
  };
  init();

  // event listeners
  // slide to the right
  btnRight.addEventListener('click', nextSlide);
  // slide to the left
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'arrowLeft') previousSlide();
    // both up and down are equivalent
    e.key === 'arrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      curSlide = slide;
      activeDot(curSlide);
    }
  });
};
totalSl();

//CHECK BELOW
// OTHER
// SELECTING elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');

document.getElementsByClassName('btn');

// CREATING and INSERTING elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it</button>';

// // PREPEND adds element as first child. Append = last child - these methods can move the elements
// //header.prepend(message);
header.append(message);

// if you want to clone...
//header.append(message.cloneNode(true));

// you can insert BEFORE and AFTER an element
// header.before(message);
// header.after(message);

// DELETE elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '105%';

// // GET the styles (written with JS)
// console.log(message.style.backgroundColor);

// // GET the styles in any case
// console.log(getComputedStyle(message).color);

// console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
// console.log(getComputedStyle(message).height);

// // EDIT CSS elements
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // HTML ATTRIBUTES
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt, logo.src, logo.className);

// const alertH1 = function (e) {
//   alert('addEventListener: Great, You are reading the heading :D');

//   h1.removeEventListener('mouseenter', alertH1);
// };

// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', alertH1);

// OR

// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great, You are reading the heading :D');
// };

// const numInBetween = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${numInBetween(0, 255)}, ${numInBetween(0, 255)}, ${numInBetween(
//     0,
//     255
//   )})`;
// //console.log(`random color: ${randomColor()}`);

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();

//   // stop propagation to the father elements
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

const h1 = document.querySelector('h1');

// going downwards: CHILD
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// going upwards: PARENTS
console.log(h1.parentNode);
console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// going sideways: SIBLINGS
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// other events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built.', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// ONLY for pages with potential data loss
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
