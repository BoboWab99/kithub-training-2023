// show date picker
const datePicker = document.querySelector('.form-date-picker')
const datePickerInput = datePicker.querySelector('[type="date"]')
const datePickerIcon = datePicker.querySelector('.icon')
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
   addEditFunc(button)
})


/**
 * @param {HTMLElement} button 
 */
function addEditFunc(button) {
   button.addEventListener('click', () => {
      let taskListItem = button.closest('.task-list-item')
      let taskContent = taskListItem.querySelector('[data-content="task"]').textContent
      let dueDate = taskListItem.querySelector('[data-content="date"]').textContent
      
      // format date to yyyy-mm-dd
      // let testDate = new Date(dueDate)
      // testDate.setFullYear(new Date().getFullYear())
      // let testDateStr = testDate.toISOString().split('T')[0]
      // console.log(testDateStr)

      document.getElementById('editTaskInput').value = taskContent
      document.getElementById('editTaskDate').value = dueDate
   })
}

/**
 * @param {HTMLElement} button 
 */
function addDeleteFunc(button) {
   // to be continued!!!
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
   const savedTasks = getSavedTasks()
   // if there are no saved tasks
   if (savedTasks.length == 0) {
      console.log('no task items set!')
      // initialize an empty array for saving the tasks
      localStorage.setItem('todo_app_tasks_db', JSON.stringify([]))
   } else {
      // display saved tasks
      displayTasks(savedTasks)
   }
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

Task.prototype.toString = function() {
   return JSON.stringify({
      id: this.id,
      task: this.task,
      dueDate: this.dueDate,
      completed: this.completed
   })
}

const newTaskForm = document.getElementById('taskForm')
const editTaskForm = document.getElementById('editTaskForm')
// or ...
// const form = document.forms.taskForm
// const form = document.forms['taskForm']
// note: 'taskForm' is the name of the form

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
   localStorage.setItem('todo_app_tasks_db', JSON.stringify(savedTasks))

   // 2. add task to UI
   const newListItem = makeListItem(newTask)
   const editButton = newListItem.querySelector('.button-edit')
   addEditFunc(editButton)
   addShowPopupFunc(editButton)
   document.querySelector('.task-list').append(newListItem)
   
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


function clearFormFields() {
   newTaskForm.elements['task'].value = ''
   newTaskForm.elements['due-date'].value = ''
}


/**
 * @returns {Array<Task>}
 */
function getSavedTasks() {
   const savedTasks = localStorage.getItem('todo_app_tasks_db')
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
   tasks.forEach(task => {
      const newListItem = makeListItem(task)
      const editButton = newListItem.querySelector('.button-edit')
      addEditFunc(editButton)
      addShowPopupFunc(editButton)
      document.querySelector('.task-list').append(newListItem)
   })
}


/**
 * @param {Task} task task to display
 */
function makeListItem(task) {
   const checked = (task.completed) ? "checked" : ""
   // let checked = ""
   // if (task.completed) {
   //    checked = "checked"
   // }

   const listItemString = `
   <li class="task-list-item" data-id="task-${task.id}">
      <label class="check">
         <input type="checkbox" ${checked}>
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

   return makeElementFromString(listItemString)   
}

/**
 * @param {String} str html string form of a HTML element
 */
function makeElementFromString(str) {
   const template = document.createElement('template')
   template.innerHTML = str.trim()
   return template.content.firstElementChild
}