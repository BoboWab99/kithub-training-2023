
const datePicker = document.querySelector('.form-date-picker')
const datePickerInput = datePicker.querySelector('[type="date"]')
const datePickerIcon = datePicker.querySelector('.icon')
const formDateHolder = document.querySelector('.form-date-holder')

const quotes = [
   "Hard work beats talent when talent doesn't work hard.",
   "Concentrate all your thoughts upon the work in hand. ",
   "Either you run the day or the day runs you.",
   "I'm a greater believer in luck, and I find the harder I work the more I have of it.",
   "When we strive to become better than we are, everything around us becomes better too."
]

window.addEventListener('DOMContentLoaded', () => {
   loopQuotes(quotes, 5000)

   if (datePickerInput.value != '') {
      formDateHolder.textContent = datePickerInput.value
   }

   // set today's date in the header
   const today = new Date()
   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

   const dayName = days[today.getDay()]
   const dateFormat = `${monthNames[today.getMonth()]} ${today.getDate()} - ${today.getFullYear()}`

   document.querySelector('.header-date .day-of-week').innerHTML = dayName
   document.querySelector('.header-date .date').innerHTML = dateFormat
})

datePickerIcon.addEventListener('click', () => {
   datePickerInput.showPicker()
})

datePickerInput.addEventListener('change', () => {
   formDateHolder.textContent = datePickerInput.value
})

/**
 * Loops through a given list of quotes and displays them
 * @param {Array} quotes list of quotes
 * @param {Number} after change quote after {after} seconds
 */
function loopQuotes(quotes, after) {
   let index = 0
   const run = () => {
      document.getElementById("quote").innerHTML = quotes[index]
      index = (index + 1) % quotes.length
      // console.log('changeQuote...')
      setTimeout(run, after)
   }
   run()
}