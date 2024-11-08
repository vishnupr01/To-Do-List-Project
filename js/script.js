document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission

  // Get form data
  const formData = new FormData(this);
  const taskName = formData.get("taskName");
  const taskDate = formData.get("taskDate");
  const taskTime = formData.get("taskTime");

  if (taskName && taskDate && taskTime) {
    const formattedTime = formatTime(taskTime);
    const formattedDate = formatDate(taskDate);

    const task = {
      name: taskName,
      date: formattedDate,
      time: formattedTime,
      rawDate: taskDate // Store the raw date for comparison
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
  const hours12 = (date.getHours() % 12 || 12).toString().padStart(2, "0");
  const am_pm = date.getHours() >= 12 ? "PM" : "AM";
  const formattedMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours12}:${formattedMinutes} ${am_pm}`;
}

// Function to format date into readable format
function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

// Function to display tasks grouped by Today, Upcoming, and Due
function displayTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Get current date for comparison
  const currentDate = new Date();
  const todayDate = formatDate(currentDate.toISOString().split('T')[0]); // Format current date

  // Initialize categories
  const todayTasks = [];
  const upcomingTasks = [];
  const dueTasks = [];

  // Group tasks by their dates
  tasks.forEach((task) => {
    const taskDate = new Date(task.rawDate);
    const taskFormattedDate = formatDate(task.rawDate);

    if (taskFormattedDate === todayDate) {
      todayTasks.push(task);
    } else if (taskDate > currentDate) {
      upcomingTasks.push(task);
    } else {
      dueTasks.push(task);
    }
  });

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear current tasks

  // Display Today tasks
  if (todayTasks.length > 0) {
    const todaySection = createTaskSection("Today", todayTasks, true); // Pass true to indicate no date for today
    taskList.appendChild(todaySection);
  }

  // Display Upcoming tasks
  if (upcomingTasks.length > 0) {
    const upcomingSection = createTaskSection("Upcoming", upcomingTasks);
    taskList.appendChild(upcomingSection);
  }

  // Display Due tasks
  if (dueTasks.length > 0) {
    const dueSection = createTaskSection("Due", dueTasks);
    taskList.appendChild(dueSection);
  }
}

// Function to create the HTML for a task section
function createTaskSection(title, tasks, isToday = false) {
  const section = document.createElement("div");
  section.className = "mb-6";  // Add margin between sections

  const sectionHeader = document.createElement("div");
  sectionHeader.className = "text-2xl font-bold text-blue-800 mb-2";
  sectionHeader.innerText = title;
  section.appendChild(sectionHeader);

  const taskItemsContainer = document.createElement("div");
  taskItemsContainer.className = "flex flex-col";  // Use flex-col for vertical alignment

  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "p-4 mb-4 rounded-md bg-gray-50 shadow-sm";  // Add shadow for visual separation

    taskItem.innerHTML = `
      <div class="flex  mb-2">
        ${!isToday ? `<div class="text-lg font-semibold  text-gray-600">${task.date}</div>` : ''}
        <div class="items-center">
          <div class="text-lg ml-2 font-semibold">${task.name} <span class="text-sm text-gray-500">at ${task.time}</span></div>
        </div>
      </div>
    `;

    taskItemsContainer.appendChild(taskItem);
  });

  section.appendChild(taskItemsContainer);
  return section;
}

// Display tasks on page load
window.addEventListener("load", displayTasks);
