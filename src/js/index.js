'use strict';

const Hamburger = document.getElementById('js-hamburger-menu');
const Nav = document.querySelector('.l-nav')
const Mask = document.querySelector('.l-mask')

Hamburger.addEventListener('click',()=>{
  const Expanded = Hamburger.getAttribute('aria-expanded');
  if(Expanded === 'false'){
    Hamburger.setAttribute('aria-expanded', 'true')
    Hamburger.classList.add('is-active')
    Nav.setAttribute('aria-hidden', 'false')
    Nav.classList.add('is-active')
    Mask.classList.add('is-active')
  } else{
    Hamburger.setAttribute('aria-expanded', 'false')
    Hamburger.classList.remove('is-active')
    Nav.setAttribute('aria-hidden', 'true');
    Nav.classList.remove('is-active')
    Mask.classList.remove('is-active')
  }
})

// 画面幅でaria属性の切替
const mediaQuery = window.matchMedia('(min-width: 992px)');

const AriaHandler = (e) =>{
  if(e.matches){
    Nav.setAttribute('aria-hidden', 'false')
    Hamburger.setAttribute('aria-expanded', 'false')
    Hamburger.setAttribute('aria-hidden', 'true')
  } else{
    Nav.setAttribute('aria-hidden', 'false')
    Hamburger.setAttribute('aria-expanded', 'false')
    Hamburger.setAttribute('aria-hidden', 'false')
  }
}

mediaQuery.addEventListener('change',AriaHandler);
AriaHandler(mediaQuery);

// side-btn

const SideBtn =  document.getElementById('is-side-btn');

window.addEventListener('scroll',()=>{
const scroll =  window.scrollY; // ここを修正
if(scroll > 30){
  SideBtn.classList.add('is-show')
  SideBtn.setAttribute('aria-hidden', 'false')
}else{
  SideBtn.classList.remove('is-show')
  SideBtn.setAttribute('aria-hidden', 'true')
}
})