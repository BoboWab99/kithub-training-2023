from django.shortcuts import render
from django.http import JsonResponse

import datetime as DT

from .models import Task
from .forms import TaskForm, EditTaskForm

# Create your views here.

def home_page(request):
   return render(request, 'index.html', {
      'tasks': Task.objects.all(),
      'new_form': TaskForm(),
      'edit_form': EditTaskForm(),
      'date_today': DT.datetime.now(),
   })


def create_task(request):
   if not request.method == 'POST':
      return JsonResponse({'msg': 'Not a POST request'})
   
   form = TaskForm(request.POST)
   if form.is_valid():
      new_task = Task.objects.create(
         task=form.cleaned_data['task'],
         due_date=form.cleaned_data['due_date']
      )
      return JsonResponse({'task_id': new_task.pk})
   else:
      return JsonResponse({'msg': form.errors.as_text()})


def update_task(request, task_id):
   if not request.method == 'POST':
      return JsonResponse({'msg': 'Not a POST request'})
   
   form = EditTaskForm(request.POST)
   if form.is_valid():
      task = Task.objects.get(id=task_id)
      task.task = form.cleaned_data['task']
      task.due_date = form.cleaned_data['due_date']
      task.completed = form.cleaned_data['completed']
      task.save()
      return JsonResponse({'msg': 'OK!'})
   else:
      return JsonResponse({'msg': form.errors.as_text()})


def delete_task(request, task_id):
   Task.objects.get(id=task_id).delete()
   return JsonResponse({})


def complete_task(request, task_id):
   task = Task.objects.get(id=task_id)
   task.completed = not task.completed
   task.save()
   return JsonResponse({'completed': task.completed})