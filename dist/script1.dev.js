"use strict";

// Set elements
var clock = document.getElementById("clock");
var alarmDateInput = document.getElementById("alarm-date");
var alarmTimeInput = document.getElementById("alarm-time");
var setAlarmButton = document.getElementById("set-alarm");
var clearAlarmButton = document.getElementById("clear-alarm");
var audioPlayer = document.getElementById("audio-player"); // Declare alarm interval ID

var alarmIntervalId; // Display current time

function displayTime() {
  var now = new Date();
  var time = now.toLocaleTimeString();
  clock.textContent = time;
} // Check alarm time


function checkAlarm() {
  var now = new Date();
  var alarmDate = parseDate(alarmDateInput.value);
  var alarmTime = parseTime(alarmTimeInput.value);

  if (alarmDate && alarmTime && alarmDate.getDate() === now.getDate() && alarmDate.getMonth() === now.getMonth() && alarmDate.getFullYear() === now.getFullYear() && alarmTime.getHours() === now.getHours() && alarmTime.getMinutes() === now.getMinutes()) {
    // Alarm time reached
    playAlarm();
  }
} // Parse date value


function parseDate(dateValue) {
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
  var alarmDate = parseDate(alarmDateInput.value);
  var alarmTime = parseTime(alarmTimeInput.value); // Clear any existing alarm interval

  clearInterval(alarmIntervalId); // Set new alarm interval

  alarmIntervalId = setInterval(checkAlarm, 1000);

  if (alarmDate && alarmTime) {
    console.log("Alarm set for: " + alarmDate + " " + alarmTime);
  } else {
    console.log("Invalid date or time format");
  }
} // Clear the alarm


function clearAlarm() {
  clearInterval(alarmIntervalId);

  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
} // Attach event listeners


setAlarmButton.addEventListener("click", setAlarm);
clearAlarmButton.addEventListener("click", clearAlarm); // Display current time initially

displayTime(); // Update time every second

setInterval(displayTime, 1000);
//# sourceMappingURL=script1.dev.js.map
