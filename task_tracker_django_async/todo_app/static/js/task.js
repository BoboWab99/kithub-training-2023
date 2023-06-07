// *** Helper classes ***

class Task {
   /**
    * @param {Number} id task ID
    * @param {String} task task to be done
    * @param {String} dueDate due date of the task 
    * @param {Boolean} completed Is task completed?
    */
   constructor(id, task, dueDate, completed = false) {
      this.id = id
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

// *** end classes ***

// *** global variables ***

const datePicker = document.querySelector('.form-date-picker')
const datePickerInput = datePicker.querySelector('[type="date"]')
const datePickerIcon = datePicker.querySelector('.icon')
const formDateHolder = document.querySelector('.form-date-holder')

const newTaskForm = document.getElementById('taskForm')
const editTaskForm = document.getElementById('editTaskForm')
const appThemeForm = document.getElementById('appThemeForm')

const taskList = document.querySelector('.task-list')
const themeToggleButton = document.querySelector('.button-theme-toggle')
const APP_COLOR_THEME = 'todo_app_color_theme'  // saved on localStorage

const quotes = [
   "Hard work beats talent when talent doesn't work hard.",
   "Concentrate all your thoughts upon the work in hand. ",
   "Either you run the day or the day runs you.",
   "I'm a greater believer in luck, and I find the harder I work the more I have of it.",
   "When we strive to become better than we are, everything around us becomes better too."
]

// *** End variables ***

// *** Event listeners ***

window.addEventListener('DOMContentLoaded', () => {
   // set color theme to saved theme
   const appColorTheme = localStorage.getItem(APP_COLOR_THEME)
   if (appColorTheme != null) {
      document.documentElement.setAttribute('data-theme', appColorTheme)
   }

   loopQuotes(quotes, 5000)

   document.querySelectorAll('.task-list-item').forEach(listItem => {
      addEditFunc(listItem.querySelector('.button-edit'))
      addDeleteFunc(listItem.querySelector('.button-delete'))
      addCompleteFunc(listItem.querySelector('[type="checkbox"]'))
   })

   if (datePickerInput.value != '') {
      formDateHolder.textContent = datePickerInput.value
   }
})

datePickerIcon.addEventListener('click', () => {
   datePickerInput.showPicker()
})

datePickerInput.addEventListener('change', () => {
   formDateHolder.textContent = datePickerInput.value
})

themeToggleButton.addEventListener('click', () => {
   const currentTheme = document.documentElement.getAttribute('data-theme')
   if (currentTheme != null) {
      document.querySelector(`[name="toggle-theme"][value="${currentTheme}"]`).checked = true
   }
})

editTaskForm.addEventListener('reset', () => {
   editTaskForm.removeAttribute('data-task-id')
})

newTaskForm.addEventListener('submit', async (e) => {
   e.preventDefault()
   
   if (newTaskForm.elements['task'].value == '') {
      // @todo: show notification
      return
   }
   const data = new FormData(newTaskForm)
   const response = await fetch(newTaskForm.getAttribute('action'), {
      method: 'POST',
      body: data
   })

   if (response.status == 200) {
      const json = await response.json()
      console.log(json)

      const newTaskListItem = makeListItem(new Task(
         json.task_id,
         data.get('task'),
         data.get('due_date')
      ))
      taskList.appendChild(newTaskListItem)

      // clear Form Fields
      newTaskForm.reset()
      formDateHolder.innerHTML = ''
   }
})


editTaskForm.addEventListener('submit', async (e) => {
   e.preventDefault()

   if (editTaskForm.elements['task'].value == '') {
      // @todo: show notification
      return
   }

   const taskId = Number(editTaskForm.getAttribute('data-task-id'))
   const data = new FormData(editTaskForm)
   const response = await fetch(`/tasks/${taskId}/edit/`, {
      method: 'POST',
      body: data
   })

   if (response.status == 200) {
      const updatedTask = data.get('task')
      const updatedDueDate = data.get('due_date')
      const updatedCompleted = data.get('completed')

      const listItem = taskList.querySelector(`[data-id="${taskId}"]`)
      listItem.querySelector('[data-content="task"]').innerHTML = updatedTask
      listItem.querySelector('[data-content="date"]').innerHTML = (updatedDueDate == '') ? 'Anytime' : updatedDueDate
      listItem.querySelector('[data-content="completed"]').checked = (updatedCompleted == 'on') ? true : false

      editTaskForm.reset()
      closePopop(e.target.closest('.popup'))
   }
})


appThemeForm.addEventListener('submit', (e) => {
   e.preventDefault()
   const newColorTheme = appThemeForm.elements['toggle-theme'].value
   localStorage.setItem(APP_COLOR_THEME, newColorTheme)
   document.documentElement.setAttribute('data-theme', newColorTheme)
   closePopop(appThemeForm.closest('.popup'))
   appThemeForm.reset()
})

// *** End event listeners ***

// *** Functions ***

/**
 * @param {HTMLElement} button 
 */
function addEditFunc(button) {
   button.addEventListener('click', (e) => {
      e.preventDefault()

      const listItem = button.closest('.task-list-item')
      const taskContent = listItem.querySelector('[data-content="task"]').textContent.trim()
      const dueDate = listItem.querySelector('[data-content="date"]').textContent.trim()
      const completedStatus = listItem.querySelector('[data-content="completed"]').checked ? true : false

      editTaskForm.setAttribute('data-task-id', listItem.getAttribute('data-id'))

      editTaskForm.elements['task'].value = taskContent
      editTaskForm.elements['due_date'].value = (dueDate == 'Anytime') ? null : dueDate
      editTaskForm.elements['completed'].checked = completedStatus
   })
}


/**
 * @param {HTMLElement} button 
 */
function addDeleteFunc(button) {
   button.addEventListener('click', async (e) => {
      e.preventDefault()
      const listItem = button.closest('.task-list-item')
      const taskId = Number(listItem.getAttribute('data-id'))
      const response = await fetch(`/tasks/${taskId}/delete/`)
      if (response.status == 200) listItem.remove()
   })
}


/**
 * @param {HTMLInputElement} checkbox 
 */
function addCompleteFunc(checkbox) {
   checkbox.addEventListener('change', async () => {
      const taskId = checkbox.closest('.task-list-item').getAttribute('data-id')
      const response = await fetch(`/tasks/${taskId}/complete/`)
      if (response.status == 200) {
         const json = await response.json()
         checkbox.checked = json.completed
      }
   })
}


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


/**
 * @param {Task} task task to display
 */
function makeListItem(task) {
   // create the list item and add all the functionalities

   const checked = (task.completed) ? "checked" : ""
   const dueDate = (task.dueDate == '') ? 'Anytime' : task.dueDate

   const listItemString = `
   <li class="task-list-item" data-id="${task.id}">
      <label class="check">
         <input type="checkbox" data-content="completed" ${checked}>
         <span class="icon"><i class="fa-regular fa-circle"></i></span>
      </label>

      <div class="content">
         <span data-content="task">${task.task}</span>
         <div class="due-date">
            <i class="fa-regular fa-calendar"></i>
            <span data-content="date">${dueDate}</span>
         </div>
      </div>

      <div class="options">
         <a type="button" class="button button-primary-transparent button-edit" href="#" data-toggle="popup" data-target="#editTaskPopup">
            <i class="fa-regular fa-pen-to-square"></i>
         </a>
         <a type="button" class="button button-danger-transparent button-delete" href="#">
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
   addCompleteFunc(checkbox)

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