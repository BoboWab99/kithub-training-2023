from django.shortcuts import render, redirect

from .models import Task
from .forms import TaskForm, EditTaskForm

# Create your views here.

def home_page(request):
   # if the form is submitted
   if request.method == 'POST': 
      form = TaskForm(request.POST)
      if form.is_valid():
         Task.objects.create(
            task=form.cleaned_data['task'],
            due_date=form.cleaned_data['due_date']
         )
         # or
         # form.save(commit=True)
      else:
         print('\n\n form not valid!')
         print(form.errors.as_text())

   # get all saved tasks
   tasks = Task.objects.all()

   # completed_tasks = Task.objects.filter(completed=True)

   return render(request, 'index.html', {
      'tasks': tasks,
      'form': TaskForm(),
      'greeting': 'Good morning'
   })


def delete_task(request, task_id):
   # get returns one item
   Task.objects.get(id=task_id).delete()
   return redirect('home-page')


def update_task(request, task_id):
   # task to be be updated
   task = Task.objects.get(id=task_id)

   if request.method == 'POST':
      form = EditTaskForm(request.POST)
      if form.is_valid():
         # update task data
         task.task = form.cleaned_data['task']
         task.due_date = form.cleaned_data['due_date']
         task.completed = form.cleaned_data['completed']
         task.save()
      else:
         # print form errors
         print('\n\n form not valid!')
         print(form.errors.as_text())

      return redirect('home-page')

   # render form with existing task data
   return render(request, 'edit-task.html', {
      'form': EditTaskForm(instance=task),
      'greeting': 'Good morning'
   })