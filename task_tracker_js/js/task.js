const LOCAL_STORAGE_NAME = 'todo_app_tasks_db'

// show date picker
const datePicker = document.querySelector('.form-date-picker')
const datePickerInput = datePicker.querySelector('[type="date"]')
const datePickerIcon = datePicker.querySelector('.icon')
const formDateHolder = document.querySelector('.form-date-holder')

const taskList = document.querySelector('.task-list')
const newTaskForm = document.getElementById('taskForm')
const editTaskForm = document.getElementById('editTaskForm')
// or ...
// const form = document.forms.taskForm
// const form = document.forms['taskForm']
// note: 'taskForm' is the name of the form


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
   addEditFunc(button)
})


/**
 * @param {HTMLElement} button 
 */
function addEditFunc(button) {
   button.addEventListener('click', () => {
      const taskListItem = button.closest('.task-list-item')
      const taskContent = taskListItem.querySelector('[data-content="task"]').textContent
      const dueDate = taskListItem.querySelector('[data-content="date"]').textContent
      const completedStatus = taskListItem.querySelector('[data-content="completed"]').checked ? true : false

      const taskId = taskListItem.getAttribute('data-id').split('-')[1]
      editTaskForm.setAttribute('data-task-id', taskId)

      document.getElementById('editTaskInput').value = taskContent
      document.getElementById('editTaskDate').value = dueDate
      document.getElementById('editTaskCheck').checked = completedStatus
   })
}


editTaskForm.addEventListener('reset', () => {
   editTaskForm.removeAttribute('data-task-id')
})


/**
 * @param {HTMLElement} button 
 */
function addDeleteFunc(button) {
   button.addEventListener('click', (e) => {
      e.preventDefault()

      // 1. find the id of list item
      const listItem = button.closest('.task-list-item')
      const taskId = listItem.getAttribute('data-id').split('-')[1]
      // console.log(taskId)

      // 2. remove the task that has that id from the database
      const savedTasks = getSavedTasks()
      const remainingTasks = savedTasks.filter(task => task.id != taskId)
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(remainingTasks))

      // 3. update the UI
      listItem.remove()
   })
}


/**
 * @param {HTMLInputElement} checkbox 
 */
function addCompletedStatusFunc(checkbox) {
   checkbox.addEventListener('change', () => {
      // 1. get status
      const completedStatus = checkbox.checked ? true : false

      // 2. find the task to edit
      const taskListItem = checkbox.closest('.task-list-item')
      const taskId = taskListItem.getAttribute('data-id').split('-')[1]
      const savedTasks = getSavedTasks()
      const taskToEdit = savedTasks.find(task => task.id == taskId)

      // 3. update the status
      taskToEdit.completed = completedStatus

      // 4. save the data
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(savedTasks))
   })
}


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
 * @param {Number} after change quote after {after} seconds
 */
function changeQuote(quotes, after) {

   let index = 0

   const run = () => {
      quoteHolder.innerHTML = quotes[index]
      index = (index + 1) % quotes.length
      // console.log('changeQuote...')

      setTimeout(run, after);
   }

   setTimeout(() => {
      run()
   }, after);
}

changeQuote(quotes, 5000)


// when page loads, show saved task items
window.addEventListener('DOMContentLoaded', () => {
   // localStorage.clear()
   const savedTasks = getSavedTasks()
   // if there are no saved tasks
   if (savedTasks.length == 0) {
      console.log('no task items set!')
      // initialize an empty array for saving the tasks
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify([]))
   } else {
      // display saved tasks
      displayTasks(savedTasks)
   }

   // set today's date in the header
   const today = new Date()
   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

   const dayName = days[today.getDay()]
   const dateFormat = `${monthNames[today.getMonth()]} ${today.getDate()} - ${today.getFullYear()}`

   document.querySelector('.header-date .day-of-week').innerHTML = dayName
   document.querySelector('.header-date .date').innerHTML = dateFormat

   // fix dates: set to minimum date to today
   document.querySelectorAll('input[type="date"]').forEach(dateInput => {
      const todayStringFormat = today.toISOString().split('T')[0]
      dateInput.setAttribute('min', todayStringFormat)
   })
})


// handle task form submissions
// create a Task class to make the work easy

class Task {
   /**
    * @param {String} task task to be done
    * @param {String} dueDate due date of the task 
    */
   constructor(task, dueDate, completed = false) {
      this.id = Date.now()
      this.task = task
      this.dueDate = dueDate
      this.completed = completed
   }
}

Task.prototype.toString = function () {
   return JSON.stringify({
      id: this.id,
      task: this.task,
      dueDate: this.dueDate,
      completed: this.completed
   })
}

newTaskForm.addEventListener('submit', (e) => {
   e.preventDefault()

   const newTask = new Task(
      newTaskForm.elements['task'].value,
      newTaskForm.elements['due-date'].value
   )

   // console.log(newTask.toString())
   // console.log(JSON.stringify(newTask))

   // 1. save task
   const savedTasks = getSavedTasks()
   savedTasks.push(newTask)
   localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(savedTasks))

   // 2. add task to UI
   taskList.append(makeListItem(newTask))

   // 3. clear form fields
   clearFormFields()

   // different ways of getting form data

   // 1.
   // console.log(form.task.value)
   // console.log(form.due-date.value)
   // console.log('\n')
   // if you're using this method, use underscores 
   // or camelcase form field names

   // 2.
   // console.log(form.elements['task'].value)
   // console.log(form.elements['due-date'].value)
   // console.log('\n')

   // 3.
   // console.log(form.querySelector('[name="task"]').value)
   // console.log(form.querySelector('[name="due-date"]').value)
   // console.log('\n')

   // 4.
   // let formData = new FormData(form)

   // for (const [key, value] of formData) {
   //    console.log(`${key}: ${value}`)
   // }
   // console.log('\n')
})


editTaskForm.addEventListener('submit', (e) => {
   e.preventDefault()

   // 1. find the task to edit
   const taskId = editTaskForm.getAttribute('data-task-id')
   const savedTasks = getSavedTasks()
   const taskToEdit = savedTasks.find(task => task.id == taskId)

   // 2. get new values
   const updatedTask = document.getElementById('editTaskInput').value
   const updatedDueDate = document.getElementById('editTaskDate').value
   const updatedCompletedStatus = document.getElementById('editTaskCheck').checked ? true : false

   // 3. update the values
   taskToEdit.task = updatedTask
   taskToEdit.dueDate = updatedDueDate
   taskToEdit.completed = updatedCompletedStatus

   // 4. save the data
   localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(savedTasks))

   // 5. update the UI
   const taskListItem = document.querySelector(`[data-id="task-${taskId}"]`)
   taskListItem.querySelector('[data-content="task"]').innerHTML = updatedTask
   taskListItem.querySelector('[data-content="date"]').innerHTML = updatedDueDate
   taskListItem.querySelector('[data-content="completed"]').checked = updatedCompletedStatus

   // 6. close popup and clear popup fields
   clearUpdateFormFields()
   closePopop(e.target.closest('.popup'))
})


function clearFormFields() {
   newTaskForm.elements['task'].value = ''
   newTaskForm.elements['due-date'].value = ''
   formDateHolder.innerHTML = ''
}


function clearUpdateFormFields() {
   document.getElementById('editTaskInput').value = ''
   document.getElementById('editTaskDate').value = ''
   document.getElementById('editTaskCheck').checked = false
}


/**
 * @returns {Array<Task>}
 */
function getSavedTasks() {
   const savedTasks = localStorage.getItem(LOCAL_STORAGE_NAME)
   return (!savedTasks) ? [] : JSON.parse(savedTasks)
   // if (!savedTasks) {
   //    return []
   // } else {
   //    return JSON.parse(savedTasks)
   // }
}


/**
 * @param {Array<Task>} tasks array of tasks
 */
function displayTasks(tasks) {
   taskList.innerHTML = ''
   tasks.forEach(task => {
      taskList.append(makeListItem(task))
   })
}


/**
 * @param {Task} task task to display
 */
function makeListItem(task) {
   // create the list item and add all the functionalities

   const checked = (task.completed) ? "checked" : ""
   // let checked = ""
   // if (task.completed) {
   //    checked = "checked"
   // }

   const listItemString = `
   <li class="task-list-item" data-id="task-${task.id}">
      <label class="check">
         <input type="checkbox" data-content="completed" ${checked}>
         <span class="icon"><i class="fa-regular fa-circle"></i></span>
      </label>

      <div class="content">
         <span data-content="task">${task.task}</span>
         <div class="due-date">
            <i class="fa-regular fa-calendar"></i>
            <span data-content="date">${task.dueDate}</span>
         </div>
      </div>

      <div class="options">
         <a type="button" class="button button-edit" href="#" data-toggle="popup" data-target="#editTaskPopup">
            <i class="fa-regular fa-pen-to-square"></i>
         </a>
         <a type="button" class="button button-delete" href="#">
            <i class="fa-regular fa-trash-can"></i>
         </a>
      </div>
   </li>`

   const newListItem = makeElementFromString(listItemString)
   const editButton = newListItem.querySelector('.button-edit')
   const deleteButton = newListItem.querySelector('.button-delete')
   const checkbox = newListItem.querySelector('[type="checkbox"]')

   addEditFunc(editButton)
   addShowPopupFunc(editButton)
   addDeleteFunc(deleteButton)
   addCompletedStatusFunc(checkbox)

   return newListItem
}


/**
 * @param {String} str html string form of a HTML element
 */
function makeElementFromString(str) {
   const template = document.createElement('template')
   template.innerHTML = str.trim()
   return template.content.firstElementChild
}