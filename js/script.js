document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission

  // Get form data
  const formData = new FormData(this);
  const taskName = formData.get("taskName");
  const taskDate = formData.get("taskDate");
  const taskTime = formData.get("taskTime");

  if (taskName && taskDate && taskTime) {
    const formattedTime = formatTime(taskTime);
    const formattedDate = formatDate(taskDate)
    console.log(formattedDate);

    const task = {
      name: taskName,
      date: formattedDate,
      time: formattedTime
    };

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Clear form fields
    this.reset();
    displayTasks();
  } else {
    alert("Please fill all fields");
  }
});

// Function to format time to 12-hour format
function formatTime(time) {
  const [hours, minutes] = time.split(":");
  let date = new Date(0, 0, 0, hours, minutes);
  // Ensure hours are in 12-hour format, but with padding if necessary
  const hours12 = (date.getHours() % 12 || 12).toString().padStart(2, "0");
  const am_pm = date.getHours() >= 12 ? "PM" : "AM";
  // Ensure minutes are always two digits
  const formattedMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours12}:${formattedMinutes} ${am_pm}`;
}
//Function to format  date into readable format
function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}


// Function to display tasks
function displayTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "p-2 mb-2  rounded-md  bg-gray-50";
    taskItem.innerHTML = `
      <div class="text-lg font-semibold">${task.date}</div>
      <div class="text-sm text-gray-600"> ${task.name} at <span class="font-bold text-black">${task.time}</span></div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Display tasks on page load
window.addEventListener("load", displayTasks);
