
const accordions = document.querySelectorAll('.accordion')

accordions.forEach(accordion => {
   makeAccordion(
      accordion.querySelector('.accordion-body'),
      accordion.querySelector('.accordion-button')
   )
})

/**
 * @param {HTMLElement} el hidden element
 */
function expand(el) {
   const height = el.scrollHeight + 'px';
   el.style.cssText = 'overflow: visible; opacity: 1; height: ' + height;
   // el.style.height = height;
   // el.style.opacity = "1";
   // el.style.overflow = "visible";
}

/**
 * @param {HTMLElement} el hidden element
 */
function shrink(el) {
   el.style = '';
}

/**
 * @param {HTMLElement} el element whose content is hidden
 * @param {HTMLElement} toggle button to show or hide the content
 */
function makeAccordion(el, toggle) {
   toggle.addEventListener('click', () => {
      if (el.style.height == '') {
         expand(el)
      } else {
         shrink(el)
      }
   })
}