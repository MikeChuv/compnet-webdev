

const onLoadHandler = function(){
    // window.alert("Прветствую Вас!")
}

const clockDisplay = document.getElementById("clock")

function showTime(){
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s;
    clockDisplay.innerText = time;
    clockDisplay.textContent = time;
}

showTime()
setInterval(showTime, 1000);





const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июнь", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

function showCalendar(month, year) {

    const firstDay = (new Date(year, month)).getDay() - 1;
    const daysInMonth = (new Date(year, month+1, 0)).getDate();

    let tbl = document.getElementById("calendar-body");

    tbl.innerHTML = "";

    monthAndYear.innerHTML = months[month] + " " + year;

    let date = 1;
    for (let week = 0; week < 6; week++) {
        let row = document.createElement("tr");

        let flag = false;
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            if (date > daysInMonth) {
                flag = true;
            }
            if ((week === 0 && dayOfWeek < firstDay) || flag) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
        if (flag) break;
    }
}