// let buttonBurgerMenu = document.querySelector('.button-menu__checkbox');
let buttonBurgerMenu = document.querySelector('.button-menu');
let mainNavigation = document.querySelector('.main-navigation__wrapper');

let nojsMainHeaderLogo = document.querySelector('.nojs__main-header-logo');
let nojsButton = document.querySelector('.nojs__button');
let nojsMainNavigation = document.querySelector('.nojs__main-navigation');
let nojsHeader = document.querySelector('.nojs__header');

function nojs() {
  nojsMainHeaderLogo.classList.remove('nojs__main-header-logo');
  nojsButton.classList.remove('nojs__button');
  nojsMainNavigation.classList.remove('nojs__main-navigation');
  nojsHeader.classList.remove('nojs__header');
}

nojs();

function openCloseMobileMenu() {

  if (mainNavigation.classList.contains('main-navigation__wrapper--close')) {
    mainNavigation.classList.remove('main-navigation__wrapper--close');
    mainNavigation.classList.add('main-navigation__wrapper--open');
    buttonBurgerMenu.classList.add('button-menu--open-menu');
  } else {
    mainNavigation.classList.add('main-navigation__wrapper--close');
    mainNavigation.classList.remove('main-navigation__wrapper--open');
    buttonBurgerMenu.classList.remove('button-menu--open-menu');
  }

}

buttonBurgerMenu.addEventListener("click", openCloseMobileMenu);
