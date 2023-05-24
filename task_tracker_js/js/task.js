// show date picker
const datePicker = document.querySelector('.form-date-picker')
const datePickerInput = document.querySelector('[type="date"]')
const datePickerIcon = document.querySelector('.icon')
const formDateHolder = document.querySelector('.form-date-holder')

datePickerIcon.addEventListener('click', () => {
   datePickerInput.showPicker()
})

datePickerInput.addEventListener('change', () => {
   formDateHolder.textContent = datePickerInput.value
})

// update task edit form values when I click "edit"
const editButtons = document.querySelectorAll('.task-list-item .button-edit')
const editTaskPopup = document.getElementById('editTaskPopup')

editButtons.forEach(button => {
   button.addEventListener('click', () => {
      let taskListItem = button.closest('.task-list-item')
      let taskContent = taskListItem.querySelector('[data-content="task"]').textContent
      let dueDate = taskListItem.querySelector('[data-content="date"]').textContent

      // format date to yyyy-mm-dd
      let testDate = new Date(dueDate)
      testDate.setFullYear(new Date().getFullYear())
      let testDateStr = testDate.toISOString().split('T')[0]
      // console.log(testDateStr)

      document.getElementById('editTaskInput').value = taskContent
      document.getElementById('editTaskDate').value = testDateStr
   })
})


// change quote after some time

const quotes = [
   "Hard work beats talent when talent doesn't work hard.",
   "Concentrate all your thoughts upon the work in hand. ",
   "Either you run the day or the day runs you.",
   "I'm a greater believer in luck, and I find the harder I work the more I have of it.",
   "When we strive to become better than we are, everything around us becomes better too."
]

const quoteHolder = document.getElementById("quote")

/**
 * @param {Array} quotes list of quotes
 * @param {Number} after after x seconds
 */
function changeQuote(quotes, after) {

   let index = 0

   const run = () => {
      quoteHolder.innerHTML = quotes[index]
      index = (index + 1) % quotes.length
      console.log('changeQuote...')

      setTimeout(run, after);
   }

   setTimeout(() => {
      run()
   }, after);
}

changeQuote(quotes, 5000)