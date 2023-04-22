

const onLoadHandler = function(){
    showCalendar();
    setInterval(showTime, 1000);
}


function showTime(){
    const clockDisplay = document.getElementById("clock")
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s;
    // clockDisplay.innerText = time;
    clockDisplay.textContent = time;
}



const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июнь", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];


function showCalendar() {
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



var ifrm = document.createElement("iframe");
ifrm.setAttribute("src", "./result_template.html");
ifrm.setAttribute("name", "formresult");
content = ifrm.contentWindow
const form = document.getElementById("BMI-form");
form.setAttribute("target", "_blank");

function processForm(event){

    console.log(event)
    // event.preventDefault();
    const algoInputValue   = document.forms["BMI"]["algo"].value;
    const heightInputValue = document.forms["BMI"]["height"].value;
    const massInputValue   = document.forms["BMI"]["mass"].value;

    console.log(algoInputValue);
    console.log(heightInputValue);
    console.log(massInputValue);

    let result = 0;
    paramStr = "location=yes,height=720,width=1280,scrollbars=yes,status=yes";
    switch (algoInputValue) {
        case "BMI":
            result = massInputValue / Math.pow(heightInputValue / 100, 2);
            console.log(result);
            try {
                ifrm.contentDocument.body.prepend("Hello, world!"); 
            } catch (error) {
                console.log(error) 
            }
            newWindow = window.open("./result_template.html", "formresult", paramStr);
            break;
        case "BrIndex":
            result = heightInputValue * 0.7 - 50;
            console.log(result);
            window.open("./result_template.html", "formresult", paramStr);
            break;

        case "NoorIndex":
            result = heightInputValue * 0.42;
            console.log(result);
            window.open("./result_template.html", "formresult", paramStr);
            break;

        case "TatIndex":
            result = heightInputValue - (100 + (heightInputValue - 100) / 20)
            console.log(result)
            window.open("./result_template.html", "formresult", paramStr);
            break;
    
        default:
            break;
    }

}


form.addEventListener('submit', processForm);