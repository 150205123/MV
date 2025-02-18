function loadDays(month) {
const daysContainer = document.getElementById('days');
daysContainer.innerHTML = ''; 

const year = 2023; 
const monthIndex = getMonthIndex(month);

const daysInMonth = [
31, // Enero
(year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28, // mes de febrero
31, // Marzo
30, // Abril
31, // Mayo
30, // Junio
31, // Julio
31, // Agosto
30, // Septiembre
31, // Octubre
30, // Noviembre
31  // Diciembre
];

const totalDays = daysInMonth[monthIndex];

for (let day = 1; day <= totalDays; day++) {
const dayDiv = document.createElement('div');
dayDiv.classList.add('day');
dayDiv.innerHTML = `<strong>${day}</strong><br><textarea placeholder="Anota algo..."></textarea>`;
daysContainer.appendChild(dayDiv);
}

document.getElementById('saveButton').style.display = 'block'; 
document.getElementById('backButton').style.display = 'block'; 
}

function getMonthIndex(month) {
const months = [
'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
'Junio', 'Julio', 'Agosto', 'Septiembre',
'Octubre', 'Noviembre', 'Diciembre'
];
return months.indexOf(month);
}

function saveData() {
const daysContainer = document.getElementById('days');
const textAreas = daysContainer.getElementsByTagName('textarea');

const data = {};
for (let i = 0; i < textAreas.length; i++) {
data[`Día ${i + 1}`] = textAreas[i].value;
}

localStorage.setItem('exportacionData', JSON.stringify(data));
alert('Datos guardados!');
}

function goBack() {
const daysContainer = document.getElementById('days');
daysContainer.innerHTML = ''; 
document.getElementById('saveButton').style.display = 'none'; 
document.getElementById('backButton').style.display = 'none'; 
}

// Cargar datos al iniciar
window.onload = function() {
const savedData = localStorage.getItem('exportacionData');
if (savedData) {
const data = JSON.parse(savedData);
const daysContainer = document.getElementById('days');
const daysInMonth = Object.keys(data).length;

for (let i = 0; i < daysInMonth; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.innerHTML = `<strong>${i + 1}</strong><br><textarea placeholder="Anota algo...">${data[`Día ${i + 1}`] || ''}</textarea>`;
    daysContainer.appendChild(dayDiv);
}
}
};
