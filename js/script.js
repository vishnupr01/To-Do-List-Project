let searchTerm = ""
let debounceTimeout;
document.getElementById("searchInput").addEventListener("input", function (e) {
  searchTerm = e.target.value.toLowerCase();
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    displayTasks(); // Call displayTasks to re-render filtered tasks
  }, 300)
});
document.getElementById("okButton").addEventListener("click", function () {
  document.getElementById("modal").classList.add("hidden");
});

// Close modal on cross icon click
document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("modal").classList.add("hidden");
});


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
      id: crypto.randomUUID(),
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
    document.getElementById("modal").classList.remove("hidden");
    return;
  }
});

let editingTask = null
// Function to format time to 12-hour format
function formatTime(time) {
  const [hours, minutes] = time.split(":");  // Split the time into hours and minutes
  let hour = parseInt(hours, 10);
  let period = "AM";

  if (hour >= 12) {
    period = "PM";
    if (hour > 12) hour -= 12;  // Convert 24-hour time to 12-hour time
  } else if (hour === 0) {
    hour = 12;  // Midnight case (00:00) should be 12:00 AM
  }

  const hours12 = hour.toString().padStart(2, "0");  // Ensure two-digit format
  const formattedMinutes = minutes.padStart(2, "0");  // Ensure two-digit format for minutes

  return `${hours12}:${formattedMinutes} ${period}`;  // Return formatted time
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
    if (task.name.toLowerCase().includes(searchTerm)) {
      const taskDate = new Date(task.rawDate);
      const taskFormattedDate = formatDate(task.rawDate);

      // Group the task based on its date (today, upcoming, or due)
      if (taskFormattedDate === todayDate) {
        todayTasks.push(task);
      } else if (taskDate > currentDate) {
        upcomingTasks.push(task);
      } else {
        dueTasks.push(task);
      }
    }
  });

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear current tasks


  // Display Due tasks
  if (dueTasks.length > 0) {
    const dueSection = createTaskSection("Due Tasks", dueTasks);
    taskList.appendChild(dueSection);
  }
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

  if (editingTask && tasks.some(task => task.id === editingTask)) {
    const editDiv = document.createElement('div');
    const taskToEdit = tasks.find(task => task.id === editingTask);
    editDiv.innerHTML = `
        <div class="p-4 mt-4 bg-gray-100 rounded-md shadow-sm">
          <h3 class="text-xl font-bold">Edit Task</h3>
          <input type="text" id="editTaskInput" value="${taskToEdit.name}" class="border p-2 rounded-md w-full mb-2"/>
          <button onclick="saveTask('${taskToEdit.id}')" class="bg-green-500 py-1 px-3 rounded-md">Save</button>
          <button onclick="cancelEdit()" class="ml-2 bg-black text-white py-1 px-3 rounded-md">Cancel</button>
        </div>
      `;
    taskList.appendChild(editDiv);
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
  taskItemsContainer.className = "flex flex-col";
  // Use flex-col for vertical alignment

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = "p-4 mb-4 rounded-md bg-gray-50 shadow-sm";  // Add shadow for visual separation
    taskItem.innerHTML = `
    <div class="flex flex-col mb-2">
      ${!isToday ? `<div class="text-lg text-black font-semibold  ">${task.date}</div>` : ''}
      <div class="items-center flex justify-between">
        <div class="text-sm mt-2">${task.name} at<span class="text-sm font-bold text-black"> ${task.time}</span></div>
  
        <div class="flex">
          <button onclick="showEditTask('${task.id}')" class="bg-yellow-500 py-1 px-3 rounded-md">Edit</button>
          <button onclick="deleteTask('${task.id}')" class="ml-2 bg-red-500 py-1 px-2 rounded-md">Delete</button>
        </div>
      </div>
    </div>
  `;

    taskItemsContainer.appendChild(taskItem);

  });

  section.appendChild(taskItemsContainer);
  return section;
}
function showEditTask(taskId) {
  console.log("tasKid in function:", typeof taskId)
  editingTask = String(taskId);
  displayTasks(); // Rerender tasks with edit field for the selected task
}
function cancelEdit() {
  editingTask = null
  displayTasks()
}
function saveTask(taskId) {
  const taskName = document.getElementById("editTaskInput").value
  if (taskName) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      task.name = taskName
      localStorage.setItem("tasks", JSON.stringify(tasks))
      editingTask = null
      displayTasks()
    }
  }

}
function deleteTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []
  const updatedTasks = tasks.filter(task => task.id !== taskId)
  localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  displayTasks()
}

// Display tasks on page load
window.addEventListener("load", displayTasks);
