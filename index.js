let new_task = document.getElementById('task_container');
let task_menu_name = document.getElementById('menu_left');
let new_task_list = document.getElementById('task_list_container');

let start_id = 1;
let select_id = 0;
let reminder_id = 0;
// Declare alarm interval ID
let alarmIntervalId;


let app_data = [
  {
    name:"Task Name", 
    task:[
      {name: "Task List", is_completed: false, id: 1},
    ], 
    id:1
  },
];

let app_reminder = [];

//allocates task names the value it has been assigned by the user 
const change_task = id => {
  const index = app_data.findIndex(task => task.id === id);

  if (index !== -1) {
    select_id = index;
    let name = app_data[select_id].name !== "Task Name" ? app_data[select_id].name : "";

    document.getElementById('task_name').value = name;
    checkAlarm(); 
    setReminder(); // Call setReminder after setting select_id and clearing date and time fields
    
  } else {
    select_id = Math.max(0, app_data.length - 1);
    document.getElementById('task_name').value = "";
  }
  if(grabDate.value === "" && grabTime.value === "") {
    // Clear and set reminder values
    grabDate.value = "";
    grabTime.value = "";
    resetReminder.style.display = "none";
    grabDate.style.display ="none";
    grabTime.style.display = "none";
    startReminder.style.display = "inline-block";
  }
  else{
    resetReminder.style.display = "inline-block";
    grabDate.style.display ="inline-block";
    grabTime.style.display = "inline-block";
  }
  set_task();
  set_task_list();
};




// gets tasks from the temporary database and displays tasks on the page
const set_task = () => {
  let content = '';

  for(let i=0; i < app_data.length; i++){
    let get_data = app_data[i];
    const className = get_data.id - 1 == select_id ? "task active" : "task";
    content += `
                <div onclick = "change_task(${get_data.id})" class="${className}">
                  ${get_data.name}
                </div>`;

  }
  new_task.innerHTML = content;
  task_menu_name.innerHTML = app_data[select_id].name;

}

// creates a new task and pushes it to the temporary database app_data
const add_task = () => {
  start_id = app_data.length > 0 ? app_data[app_data.length - 1].id + 1 : 1;

  app_data.push({
    name: "Task Name",
    task: [{ name: "Task List", is_completed: false, id: 1 }],
    id: start_id,
  });

  set_task();
  setReminder();
  console.log(app_data);
};



// gets the task name when it is inputed in the main area and displays it in the menu section
const get_task_name = () => {
  let get_task_title = document.getElementById('task_name').value;
  app_data[select_id].name = get_task_title;

  set_task();
  
}

// grab task list names
const change_task_list = id => {
  const position = id - 1;
  const task_list_input = document.getElementById("task_list_"+id);

  app_data[select_id].task[position].name = task_list_input.value;

}


// fetch task lists from database
const set_task_list = () => {
  let content = '';

  for (let index = 0; index < app_data[select_id].task.length; index++) {
    const element = app_data[select_id].task[index];

    const input_value = element.name == "Task List" ? "" : element.name;

    content += `<div id="task_list">
                <input type="checkbox" name="task_list_name" id="task_list_checkbox">
                <input type="text" oninput="change_task_list(${element.id})" id="task_list_${element.id}" value="${input_value}" placeholder="Task List">
              </div>`
    
  }
  new_task_list.innerHTML = content;
}

// Add task_list to task page
const add_task_list = () => {
  const task_list_length = app_data[select_id].task.length;
  const last_id = app_data[select_id].task[task_list_length - 1].id;

  app_data[select_id].task.push({name: "Task List", is_completed: false, id: last_id + 1});
  set_task_list();
}

// Delete Task
const delete_task = () => {
  if (app_data.length <= 1) {
    alert("Cannot delete the last task.");
    return;
  }

  app_data.splice(select_id, 1); // Remove 1 element at the specified index

  if (select_id >= app_data.length) {
    select_id = app_data.length - 1; // Adjust select_id if it exceeds the array bounds
  }

  set_task();
  set_task_list();
  change_task(select_id + 1); // Load the next task
};

// Refresh Task
const refresh = () => {
  app_data = [{
    name:"Task Name", 
    task:[
      {name: "Task List", is_completed: false, id: 1},
    ], 
    id:1
  },
];

select_id = 0;
document.getElementById('task_name').value="";
grabDate.value = "";
grabTime.value = "";
resetReminder.style.display = "none";
grabDate.style.display ="none";
grabTime.style.display = "none";
startReminder.style.display = "inline-block";

set_task();
set_task_list();
}

// display task name on reload
set_task();
// displays task list on reload
set_task_list();

// Reminder Section 
let grabDate= document.getElementById('date');
let grabTime = document.getElementById('time');
let resetReminder = document.getElementById('reset');
let startReminder = document.getElementById('start_reminder');
let audioPlayer = document.getElementById('audio_player');


// get the task name associated with the reminder
const setReminderToTask = () => {
  const selectedTaskName = app_data[select_id].name;
  const existingReminder = app_reminder.find(reminder => reminder.name === selectedTaskName);
  const dateValue = grabDate.value.trim();
  const timeValue = grabTime.value.trim();

  if (dateValue !== '' && timeValue !== '') {
    if (existingReminder) {
      // existingReminder.date.push(dateValue);
      // existingReminder.time.push(timeValue);
    } else {
      const reminder = {
        name: selectedTaskName,
        date: [dateValue],
        time: [timeValue],
        id: reminder_id + 1
      };
      app_reminder.push(reminder);
      reminder_id++; // Increment the reminder_id for the next reminder
    }

    console.log(app_reminder);
  }
};


// show date and time
const show_date_time = () => {
  document.getElementById('schedule_time').style.marginTop = "20px";
  grabDate.style.display = "inline-block";
  grabTime.style.display = "inline-block";
  startReminder.style.display = "inline-block";
  resetReminder.style.display = "inline-block";
}

// Check alarm time
// Function to check if alarm time is reached and play the alarm
function checkAlarm() {
  var now = new Date();
  for (const reminder of app_reminder) {
    for (let i = 0; i < reminder.date.length; i++) {
      var alarmDate = parseDate(reminder.date[i]);
      var alarmTime = parseTime(reminder.time[i]);

      if (
        alarmDate &&
        alarmTime &&
        alarmDate.getDate() === now.getDate() &&
        alarmDate.getMonth() === now.getMonth() &&
        alarmDate.getFullYear() === now.getFullYear() &&
        alarmTime.getHours() === now.getHours() &&
        alarmTime.getMinutes() === now.getMinutes()
      ) {
        // Alarm time reached for the current reminder
        playAlarm();
      }
    }
  }
}

// Set interval to check the alarm every second
setInterval(checkAlarm, 1000);



// Parse date value
function parseDate(dateValue) {
  if (typeof dateValue !== 'string' || dateValue.trim() === '') {
    return null;
  }

  var dateParts = dateValue.split("-");
  if (dateParts.length === 3) {
    var year = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]) - 1; // Months are zero-based (0-11)
    var day = parseInt(dateParts[2]);
    return new Date(year, month, day);
  }
  return null;
}

// Parse time value
function parseTime(timeValue) {
  if (typeof timeValue !== 'string' || timeValue.trim() === '') {
    return null;
  }

  var timeParts = timeValue.split(":");
  if (timeParts.length === 2) {
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    return new Date(1970, 0, 1, hours, minutes);
  }
  return null;
}

// Play alarm sound
function playAlarm() {
  if (audioPlayer.paused) {
    audioPlayer.play().catch(function (error) {
      console.log("Failed to play the audio: " + error.message);
    });
  }
}

// Set the alarm
function setAlarm() {
  var alarmDate = parseDate(grabDate.value);
  var alarmTime = parseTime(grabTime.value);

  // Clear any existing alarm interval
  clearInterval(alarmIntervalId);

  // Set new alarm interval to check every second
  alarmIntervalId = setInterval(checkAlarm, 1000);

  if (alarmDate && alarmTime) {
    console.log("Alarm set for: " + alarmDate + " " + alarmTime);
  } else {
    console.log("Invalid date or time format");
  }

  setReminderToTask();
}


// Clear the alarm
function clearAlarm() {
  const selectedTaskName = app_data[select_id].name;
  const reminder = app_reminder.find(reminder => reminder.name === selectedTaskName);

  clearInterval(alarmIntervalId);
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    grabDate.value = "";
    grabTime.value = "";
    grabDate.style.display = "none";
    grabTime.style.display = "none";
    resetReminder.style.display = "none";
    reminder.date = "";
    reminder.time = "";
  }
}


// Attach event listeners
startReminder.addEventListener("click", setAlarm);
resetReminder.addEventListener("click", clearAlarm);


// change reminder time base on the task selected
const setReminder = () => {
  const selectedTaskName = app_data[select_id].name;
  const reminder = app_reminder.find(reminder => reminder.name === selectedTaskName);

  if (reminder && reminder.date && reminder.time) {
    grabDate.value = reminder.date; // Assuming grabDate is an input field
    grabTime.value = reminder.time; // Assuming grabTime is an input field
    startReminder.style.display = "none";
  } else {
    grabDate.value = "";
    grabTime.value = "";
  }
};



