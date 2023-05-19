from django.urls import path

from main.views import home_page, update_task, delete_task


urlpatterns = [
    
   path('', home_page, name='home-page'),
   path('tasks/<int:task_id>/delete/', delete_task, name='delete-task'),
   path('tasks/<int:task_id>/edit/', update_task, name='edit-task'),
    
]