from django.db import models

# Create your models here.
   
class Task(models.Model):
   task = models.CharField(max_length=500)
   # comment = models.CharField(max_length=5000)
   date_added = models.DateTimeField(auto_now_add=True)
   due_date = models.DateTimeField(blank=True, null=True)
   date_modified = models.DateTimeField(auto_now=True)
   completed = models.BooleanField(default=False)

   def __str__(self):
      return f'{self.task} due: {self.due_date}'