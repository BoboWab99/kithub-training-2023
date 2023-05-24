

let toggleButtons = document.querySelectorAll('[data-toggle="popup"]')
let closeButtons = document.querySelectorAll('[data-close="popup"]')


toggleButtons.forEach(button => {
   button.addEventListener('click', () => {
      const popupId = button.getAttribute('data-target')
      const popup = document.querySelector(popupId)
      popup.classList.add('show')
   })
})


closeButtons.forEach(button => {
   button.addEventListener('click', () => {
      const popup = button.closest('.popup.show')
      popup.classList.remove('show')
   })
})