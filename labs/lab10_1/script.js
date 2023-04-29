
let globalDate;

const onLoadHandler = function(){
    showCalendar();
    setInterval(showTime, 1000);
}


function showTime(){
    const clockDisplay = document.getElementById("clock")
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    let localDate = date.getDate();
    if (localDate != globalDate) {
        showCalendar();
        globalDate = localDate;
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    let time = h + ":" + m + ":" + s;
    // clockDisplay.innerText = time;
    clockDisplay.textContent = time;
}



const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июнь", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];


function showCalendar() {
    console.log("showCalendar")
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    let monthAndYear = document.getElementById("monthAndYear");
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
                let cellTextElem = document.createElement("p");
                cellTextElem.classList.add("calendar-cell-p")
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                    cellTextElem.classList.add("text-accent");
                }
                cellTextElem.appendChild(cellText);
                cell.appendChild(cellTextElem);
                row.appendChild(cell);
                date++;
            }
        }
        if (flag) break;
        tbl.appendChild(row);
    }
}




const form = document.getElementById("BMI-form");


function getBMIDescr(BMIvalue){
    if (BMIvalue <= 16) {
        return "Выраженный дефицит массы тела";
    } else if(BMIvalue > 16 && BMIvalue < 18.5) {
        return "Недостаточная (дефицит) масса тела";
    } else if(BMIvalue > 18.5 && BMIvalue < 25) {
        return "Норма";
    } else if(BMIvalue > 25 && BMIvalue < 30) {
        return "Избыточная масса тела (предожирение)"
    } else if(BMIvalue > 30 && BMIvalue < 35) {
        return "Ожирение первой степени"
    } else if (BMIvalue > 35 && BMIvalue < 40) {
        return "Ожирение второй степени"
    } else {
        return "Ожирение третьей степени (морбидное)"
    }
}


function processForm(event){

    console.log(event)
    event.preventDefault();
    const algoInputValue   = document.forms["BMI"]["algo"].value;
    const heightInputValue = document.forms["BMI"]["height"].value;
    const massInputValue   = document.forms["BMI"]["mass"].value;

    console.log(algoInputValue);
    console.log(heightInputValue);
    console.log(massInputValue);

    let result = 0;
    switch (algoInputValue) {
        case "BMI":
            result = massInputValue / Math.pow(heightInputValue / 100, 2);

            newWindow = window.open("./result_template.html");
            newWindow.onload = function() {
                elem = newWindow.document.getElementById("result")
                elem.innerHTML = `<p>Индекс массы тела: ${result}</p><p>${getBMIDescr(result)}</p>`
            }
            break;
        case "BrIndex":
            result = heightInputValue * 0.7 - 50;
            console.log(result);
            newWindow = window.open("./result_template.html");
            newWindow.onload = function() {
                elem = newWindow.document.getElementById("result")
                elem.innerHTML = `<p>Индекс Брейтмана (нормальный вес для роста ${heightInputValue}): ${result}</p>`
            }
            break;

        case "NoorIndex":
            result = heightInputValue * 0.42;
            console.log(result);
            newWindow = window.open("./result_template.html");
            newWindow.onload = function() {
                elem = newWindow.document.getElementById("result")
                elem.innerHTML = `<p>Индекс Ноордена (нормальный вес для роста ${heightInputValue}): ${result}</p>`
            }
            break;

        case "TatIndex":
            result = heightInputValue - (100 + (heightInputValue - 100) / 20)
            console.log(result)
            newWindow = window.open("./result_template.html");
            newWindow.onload = function() {
                elem = newWindow.document.getElementById("result")
                elem.innerHTML = `<p>Индекс Татоня (номальный вес для роста ${heightInputValue}): ${result}</p>`
            }
            break;
    
        default:
            break;
    }

}


form.addEventListener('submit', processForm);