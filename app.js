// ======= Configuration =======
let reminderInterval = 10;
const minInterval = 5;
const maxInterval = 60;
const snarkyRemarks = [
    "Oops! Slacking again? 😏",
    "Come on, you can do better! 😅",
    "Streak lost… feel that sting? 🩹",
    "You missed a task. Unacceptable! 😤",
    "Snap! Time to redeem yourself 🔥"
];
// ======= Storage Helpers =======
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("streak", streak);
    localStorage.setItem("reminderInterval", reminderInterval);
}
function loadData() {
    tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    streak = parseInt(localStorage.getItem("streak") || "0");
    reminderInterval = parseInt(localStorage.getItem("reminderInterval") || "10");
}
// ======= Task & Streak Logic =======
let tasks = [];
let streak = 0;
const taskList = document.getElementById("taskList");
const streakEl = document.getElementById("streak");
const streakBar = document.getElementById("streakBar");
const maxStreakCellsPerRow = 7;
function renderStreakBar() {
    streakBar.innerHTML = "";
    const totalRows = Math.ceil(streak / maxStreakCellsPerRow);
    for(let row = 0; row < totalRows; row++){
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex"; rowDiv.style.gap = "4px";
        const cellsInRow = (row === totalRows-1) ? streak % maxStreakCellsPerRow || maxStreakCellsPerRow : maxStreakCellsPerRow;
        for(let i=0;i<cellsInRow;i++){
            const cell = document.createElement("div");
            cell.classList.add("streak-cell","filled");
            const icons = ["⚙️","💎","🔹"];
            cell.textContent = icons[(row*cellsInRow+i)%icons.length];
            rowDiv.appendChild(cell);
        }
        streakBar.appendChild(rowDiv);
    }
}
function animateStreak() { streakEl.textContent = `Streak: ${streak}`; renderStreakBar(); }
function completeTask(index) { tasks[index].completed = true; renderTasks(); saveData(); checkStreak(); }
function checkStreak() {
    if(tasks.every(t => t.completed)) { streak++; notify(`Power-up! Streak continues! ⚡`); }
    else { if(streak>0) handleStreakLoss(); const snark=snarkyRemarks[Math.floor(Math.random()*snarkyRemarks.length)]; notify(snark); } saveData();
}
function handleStreakLoss() {
    const cells = streakBar.querySelectorAll(".streak-cell");
    cells.forEach(c=>{ c.classList.remove("filled"); c.classList.add("lost"); });
    setTimeout(()=>cells.forEach(c=>c.classList.remove("lost")),500); streak=0;
}
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task,i)=>{
        const li=document.createElement("li");
        li.textContent = task.title + (task.completed?" ✅":"");
        li.addEventListener("click",()=>completeTask(i));
        taskList.appendChild(li);
    });
    animateStreak();
}
document.getElementById("addTaskBtn").addEventListener("click",()=>{
    const title = prompt("Task title:");
    if(title){ tasks.push({title,completed:false}); renderTasks(); saveData(); }
});
function setReminderInterval() {
    const mins = prompt(`Set reminder interval (minutes, ${minInterval}-${maxInterval}):`,reminderInterval);
    const value = parseInt(mins);
    if(!isNaN(value)&&value>=minInterval&&value<=maxInterval){ reminderInterval=value; saveData(); alert(`Reminder interval set to ${reminderInterval} min`); }
    else alert("Invalid value!");
}
function notify(message){
    if(Notification.permission==="granted"){ new Notification(message); }
    else if(Notification.permission!=="denied"){ Notification.requestPermission().then(p=>{ if(p==="granted") new Notification(message); }); }
}
function startReminders(){
    setInterval(()=>{ tasks.forEach(t=>{ if(!t.completed) notify(`Reminder: "${t.title}" is still pending! ⏰`); }); }, reminderInterval*60*1000);
}
loadData(); renderTasks(); startReminders();