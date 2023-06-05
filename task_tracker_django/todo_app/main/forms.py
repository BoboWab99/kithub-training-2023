from django import forms
from django.forms import ModelForm
import datetime as DT

from .models import Task


class TaskForm(ModelForm):
   class Meta:
      model = Task
      fields = ['task', 'due_date']

      widgets = {
         'due_date': forms.DateInput(attrs={
            'type': 'date',
            'min': DT.date.today()
         }),
      }

class EditTaskForm(ModelForm):
   class Meta:
      model = Task
      fields = '__all__'

      widgets = {
         'due_date': forms.DateInput(attrs={
            'type': 'date',
            'min': DT.date.today()
         }),
      }
