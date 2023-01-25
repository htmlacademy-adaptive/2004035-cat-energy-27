let buttonBurgerMenu = document.querySelector('.button-menu__checkbox');
let mainNavigation = document.querySelector('.main-navigation');

function openCloseMobileMenu() {

  // if (buttonBurgerMenu.checked) {
  //   mainNavigation.classList.add('main-navigation--close');
  // } else {
  //   mainNavigation.classList.remove('main-navigation--close');
  // }

  let mainNavigationClassList = mainNavigation.classList;
  // console.log(mainNavigationClassList);

  if (mainNavigationClassList[1] == 'main-navigation--close') {
    mainNavigation.classList.remove('main-navigation--close');
  } else {
    mainNavigation.classList.add('main-navigation--close');
  }

}

buttonBurgerMenu.addEventListener("click", openCloseMobileMenu);
