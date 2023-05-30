
let toggleButtons = document.querySelectorAll('[data-toggle="popup"]')
let closeButtons = document.querySelectorAll('[data-close="popup"]')

toggleButtons.forEach(button => {
   addShowPopupFunc(button)
})

closeButtons.forEach(button => {
   addClosePopopFunc(button)
})


/**
 * @param {HTMLElement} button 
 */
function addShowPopupFunc(button) {
   button.addEventListener('click', () => {
      const popupId = button.getAttribute('data-target')
      const popup = document.querySelector(popupId)
      popup.classList.add('show')
   })
}


/**
 * @param {HTMLElement} button 
 */
function addClosePopopFunc(button) {
   button.addEventListener('click', () => {
      const popup = button.closest('.popup.show')
      popup.classList.remove('show')
   })
}