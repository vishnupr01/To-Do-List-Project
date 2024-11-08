function addingTask() {
  const taskName = document.getElementById("taskName").value
  const taskDate = document.getElementById('taskDate').value
  const taskTime = document.getElementById('taskTime').value
  console.log(taskName)
  console.log(taskDate)
  console.log(taskTime)
  if (taskTime && taskDate && taskName) {
    const formatedTime = formatingTime(taskTime)
    console.log("formated time:", formatedTime)
    const task = {
      name: taskName,
      date: taskDate,
      time: formatedTime
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

// function format to 12 hour
function formatingTime(time) {
  const [hours, minutes] = time.split('')
  const date = new Date(0, 0, 0, hours, minutes);
  console.log("hours:", hours, minutes);
  const hours12 = date.getHours() % 12 || 12;
  const am_pm = date.getHours() >= 12 ? 'PM' : 'AM'
  const formattedTime = `${hours12}:${String(date.getMinutes()).padStart(2, '0')} ${am_pm}`;
  return formattedTime

}