"use strict";

var new_task = document.getElementById('task_container');
var task_menu_name = document.getElementById('menu_left');
var new_task_list = document.getElementById('task_list_container');
var start_id = 1;
var select_id = 0;
var reminder_id = 0; // Declare alarm interval ID

var alarmIntervalId;
var app_data = [{
  name: "Task Name",
  task: [{
    name: "Task List",
    is_completed: false,
    id: 1
  }],
  id: 1
}];
var app_reminder = []; //allocates task names the value it has been assigned by the user 

var change_task = function change_task(id) {
  var index = app_data.findIndex(function (task) {
    return task.id === id;
  });

  if (index !== -1) {
    select_id = index;
    var name = app_data[select_id].name !== "Task Name" ? app_data[select_id].name : "";
    document.getElementById('task_name').value = name;
    checkAlarm();
    setReminder(); // Call setReminder after setting select_id and clearing date and time fields
  } else {
    select_id = Math.max(0, app_data.length - 1);
    document.getElementById('task_name').value = "";
  }

  if (grabDate.value === "" && grabTime.value === "") {
    // Clear and set reminder values
    grabDate.value = "";
    grabTime.value = "";
    resetReminder.style.display = "none";
    grabDate.style.display = "none";
    grabTime.style.display = "none";
    startReminder.style.display = "inline-block";
  } else {
    resetReminder.style.display = "inline-block";
    grabDate.style.display = "inline-block";
    grabTime.style.display = "inline-block";
  }

  set_task();
  set_task_list();
}; // gets tasks from the temporary database and displays tasks on the page


var set_task = function set_task() {
  var content = '';

  for (var i = 0; i < app_data.length; i++) {
    var get_data = app_data[i];
    var className = get_data.id - 1 == select_id ? "task active" : "task";
    content += "\n                <div onclick = \"change_task(".concat(get_data.id, ")\" class=\"").concat(className, "\">\n                  ").concat(get_data.name, "\n                </div>");
  }

  new_task.innerHTML = content;
  task_menu_name.innerHTML = app_data[select_id].name;
}; // creates a new task and pushes it to the temporary database app_data


var add_task = function add_task() {
  start_id = app_data.length > 0 ? app_data[app_data.length - 1].id + 1 : 1;
  app_data.push({
    name: "Task Name",
    task: [{
      name: "Task List",
      is_completed: false,
      id: 1
    }],
    id: start_id
  });
  set_task();
  setReminder();
  console.log(app_data);
}; // gets the task name when it is inputed in the main area and displays it in the menu section


var get_task_name = function get_task_name() {
  var get_task_title = document.getElementById('task_name').value;
  app_data[select_id].name = get_task_title;
  set_task();
}; // grab task list names


var change_task_list = function change_task_list(id) {
  var position = id - 1;
  var task_list_input = document.getElementById("task_list_" + id);
  app_data[select_id].task[position].name = task_list_input.value;
}; // fetch task lists from database


var set_task_list = function set_task_list() {
  var content = '';

  for (var index = 0; index < app_data[select_id].task.length; index++) {
    var element = app_data[select_id].task[index];
    var input_value = element.name == "Task List" ? "" : element.name;
    content += "<div id=\"task_list\">\n                <input type=\"checkbox\" name=\"task_list_name\" id=\"task_list_checkbox\">\n                <input type=\"text\" oninput=\"change_task_list(".concat(element.id, ")\" id=\"task_list_").concat(element.id, "\" value=\"").concat(input_value, "\" placeholder=\"Task List\">\n              </div>");
  }

  new_task_list.innerHTML = content;
}; // Add task_list to task page


var add_task_list = function add_task_list() {
  var task_list_length = app_data[select_id].task.length;
  var last_id = app_data[select_id].task[task_list_length - 1].id;
  app_data[select_id].task.push({
    name: "Task List",
    is_completed: false,
    id: last_id + 1
  });
  set_task_list();
}; // Delete Task


var delete_task = function delete_task() {
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
}; // Refresh Task


var refresh = function refresh() {
  app_data = [{
    name: "Task Name",
    task: [{
      name: "Task List",
      is_completed: false,
      id: 1
    }],
    id: 1
  }];
  select_id = 0;
  document.getElementById('task_name').value = "";
  grabDate.value = "";
  grabTime.value = "";
  resetReminder.style.display = "none";
  grabDate.style.display = "none";
  grabTime.style.display = "none";
  startReminder.style.display = "inline-block";
  set_task();
  set_task_list();
}; // display task name on reload


set_task(); // displays task list on reload

set_task_list(); // Reminder Section 

var grabDate = document.getElementById('date');
var grabTime = document.getElementById('time');
var resetReminder = document.getElementById('reset');
var startReminder = document.getElementById('start_reminder');
var audioPlayer = document.getElementById('audio_player'); // get the task name associated with the reminder

var setReminderToTask = function setReminderToTask() {
  var selectedTaskName = app_data[select_id].name;
  var existingReminder = app_reminder.find(function (reminder) {
    return reminder.name === selectedTaskName;
  });
  var dateValue = grabDate.value.trim();
  var timeValue = grabTime.value.trim();

  if (dateValue !== '' && timeValue !== '') {
    if (existingReminder) {// existingReminder.date.push(dateValue);
      // existingReminder.time.push(timeValue);
    } else {
      var reminder = {
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
}; // show date and time


var show_date_time = function show_date_time() {
  document.getElementById('schedule_time').style.marginTop = "20px";
  grabDate.style.display = "inline-block";
  grabTime.style.display = "inline-block";
  startReminder.style.display = "inline-block";
  resetReminder.style.display = "inline-block";
}; // Check alarm time
// Function to check if alarm time is reached and play the alarm


function checkAlarm() {
  var now = new Date();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = app_reminder[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var reminder = _step.value;

      for (var i = 0; i < reminder.date.length; i++) {
        var alarmDate = parseDate(reminder.date[i]);
        var alarmTime = parseTime(reminder.time[i]);

        if (alarmDate && alarmTime && alarmDate.getDate() === now.getDate() && alarmDate.getMonth() === now.getMonth() && alarmDate.getFullYear() === now.getFullYear() && alarmTime.getHours() === now.getHours() && alarmTime.getMinutes() === now.getMinutes()) {
          // Alarm time reached for the current reminder
          playAlarm();
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
} // Set interval to check the alarm every second


setInterval(checkAlarm, 1000); // Parse date value

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
} // Parse time value


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
} // Play alarm sound


function playAlarm() {
  if (audioPlayer.paused) {
    audioPlayer.play()["catch"](function (error) {
      console.log("Failed to play the audio: " + error.message);
    });
  }
} // Set the alarm


function setAlarm() {
  var alarmDate = parseDate(grabDate.value);
  var alarmTime = parseTime(grabTime.value); // Clear any existing alarm interval

  clearInterval(alarmIntervalId); // Set new alarm interval to check every second

  alarmIntervalId = setInterval(checkAlarm, 1000);

  if (alarmDate && alarmTime) {
    console.log("Alarm set for: " + alarmDate + " " + alarmTime);
  } else {
    console.log("Invalid date or time format");
  }

  setReminderToTask();
} // Clear the alarm


function clearAlarm() {
  var selectedTaskName = app_data[select_id].name;
  var reminder = app_reminder.find(function (reminder) {
    return reminder.name === selectedTaskName;
  });
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
} // Attach event listeners


startReminder.addEventListener("click", setAlarm);
resetReminder.addEventListener("click", clearAlarm); // change reminder time base on the task selected

var setReminder = function setReminder() {
  var selectedTaskName = app_data[select_id].name;
  var reminder = app_reminder.find(function (reminder) {
    return reminder.name === selectedTaskName;
  });

  if (reminder && reminder.date && reminder.time) {
    grabDate.value = reminder.date; // Assuming grabDate is an input field

    grabTime.value = reminder.time; // Assuming grabTime is an input field

    startReminder.style.display = "none";
  } else {
    grabDate.value = "";
    grabTime.value = "";
  }
};
//# sourceMappingURL=index.dev.js.map
