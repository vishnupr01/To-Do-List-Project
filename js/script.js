function addingTask() {
  const taskName = document.getElementById("taskName").value
  const taskDate = document.getElementById('taskDate').value
  const taskTime = document.getElementById('taskTime').value
 console.log(taskName)
 console.log(taskDate)
 console.log(taskTime)
  if (taskTime && taskDate && taskName) {
    const task = {
      name: taskName,
      date: taskDate,
      time: taskTime
    }
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    document.getElementById('taskName').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskTime').value = '';

  } else {
    alert("Please fill all fields")
  }
}