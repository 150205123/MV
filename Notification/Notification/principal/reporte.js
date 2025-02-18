const clavesRegistros = [
  'registrosArchivo1', 
  'registrosArchivo2', 
  'registrosArchivo3', 
  'registrosArchivo4', 
  'registrosArchivo5', 
  'registrosArchivo6'
];

function agregarRegistro() {
  const numero = document.getElementById("numero").value;
  const area = document.getElementById("area").value;
  const descripcion = document.getElementById("descripcion").value;
  const proveedor = document.getElementById("proveedor").value;
  const responsable = document.getElementById("responsable").value;
  const fechaVencimiento = document.getElementById("fechaVencimiento").value;
  const observacion = document.getElementById("observacion").value;

  const anioVencimiento = new Date(fechaVencimiento).getFullYear();
  if (anioVencimiento < 2020 || anioVencimiento > 2060) {
      alert("Fecha de vencimiento incorrecta. El año debe estar entre 2020 y 2060.");
      return;
  }

  if (numero && area && descripcion && proveedor && responsable && fechaVencimiento && observacion) {
      const tabla = document.getElementById("tablaRegistros").getElementsByTagName('tbody')[0];
      const nuevaFila = tabla.insertRow();

      const fechaVenc = new Date(fechaVencimiento);
      const fechaHoy = new Date();
      const diferenciaEnMilisegundos = fechaVenc - fechaHoy;
      const diasRestantes = Math.floor(diferenciaEnMilisegundos / (1000 * 3600 * 24));

      let indicacion = "";
      if (diasRestantes < 0) {
          indicacion = "Venció";
      } else if (diasRestantes <= 7) {
          indicacion = "En proceso de vencimiento";
      } else {
          indicacion = "Aún no vence";
      }

      nuevaFila.innerHTML = `
          <td>${numero}</td>
          <td>${area}</td>
          <td>${descripcion}</td>
          <td>${proveedor}</td>
          <td>${responsable}</td>
          <td>${fechaVencimiento}</td>
          <td>${observacion}</td>
          <td>${diasRestantes}</td>
          <td>${indicacion}</td>
          <td>
              <select>
                  <option value="No realizado">No realizado</option>
                  <option value="En proceso" selected>En proceso</option>
                  <option value="Realizado">Realizado</option>
              </select>
          </td>
          <td class="acciones-btns">
              <button class="edit-btn" onclick="editarRegistro(this)">Editar</button>
              <button onclick="eliminarRegistro(this)">Eliminar</button>
          </td>
      `;

      const archivo = 'registrosArchivo1'; 
      const registrosGuardados = JSON.parse(localStorage.getItem(archivo)) || [];
      registrosGuardados.push({
          numero, area, descripcion, proveedor, responsable, fechaVencimiento, observacion, diasRestantes, indicacion, estadoProceso: "En proceso"
      });
      localStorage.setItem(archivo, JSON.stringify(registrosGuardados));

      document.getElementById("numero").value = getNextNumero();
      document.getElementById("area").value = 'CALIDAD';
      document.getElementById("descripcion").value = '';
      document.getElementById("proveedor").value = '';
      document.getElementById("responsable").value = 'PERLA SOTELO';
      document.getElementById("fechaVencimiento").value = '';
      document.getElementById("observacion").value = '';
  } else {
      alert("Por favor, completa todos los campos.");
  }
}

function getNextNumero() {
  const tabla = document.getElementById("tablaRegistros");
  const filas = tabla.getElementsByTagName("tr");
  let maxNumero = 0;

  for (let i = 0; i < filas.length; i++) {
      const celdas = filas[i].getElementsByTagName("td");
      if (celdas.length > 0) {
          const numero = parseInt(celdas[0].textContent, 10);
          if (numero > maxNumero) {
              maxNumero = numero;
          }
      }
  }

  return maxNumero + 1;
}

function cargarRegistros() {
  const tabla = document.getElementById("tablaRegistros").getElementsByTagName('tbody')[0];
  let registrosCombinados = [];

  clavesRegistros.forEach(clave => {
      const registrosGuardados = JSON.parse(localStorage.getItem(clave));
      if (registrosGuardados) {
          registrosCombinados = registrosCombinados.concat(registrosGuardados);
      }
  });

  tabla.innerHTML = '';

  registrosCombinados.forEach(registro => {
      const nuevaFila = tabla.insertRow();
      const fechaVenc = new Date(registro.fechaVencimiento);
      const fechaHoy = new Date();
      const diferenciaEnMilisegundos = fechaVenc - fechaHoy;
      const diasRestantes = Math.floor(diferenciaEnMilisegundos / (1000 * 3600 * 24));

      let indicacion = "";
      if (diasRestantes < 0) {
          indicacion = "Venció";
      } else if (diasRestantes <= 7) {
          indicacion = "En proceso de vencimiento";
      } else {
          indicacion = "Aún no vence";
      }

      nuevaFila.innerHTML = `
          <td>${registro.numero}</td>
          <td>${registro.area}</td>
          <td>${registro.descripcion}</td>
          <td>${registro.proveedor}</td>
          <td>${registro.responsable}</td>
          <td>${registro.fechaVencimiento}</td>
          <td>${registro.observacion}</td>
          <td>${diasRestantes}</td>
          <td>${indicacion}</td>
          <td>
              <select>
                  <option value="No realizado" ${registro.estadoProceso === 'No realizado' ? 'selected' : ''}>No realizado</option>
                  <option value="En proceso" ${registro.estadoProceso === 'En proceso' ? 'selected' : ''}>En proceso</option>
                  <option value="Realizado" ${registro.estadoProceso === 'Realizado' ? 'selected' : ''}>Realizado</option>
              </select>
          </td>
          <td class="acciones-btns">
              <button class="edit-btn" onclick="editarRegistro(this)">Editar</button>
              <button onclick="eliminarRegistro(this)">Eliminar</button>
          </td>
      `;
  });
}

window.onload = cargarRegistros;

function eliminarRegistro(boton) {
  const fila = boton.closest('tr');
  const numero = fila.cells[0].textContent;
  fila.remove();

  clavesRegistros.forEach(clave => {
      const registrosGuardados = JSON.parse(localStorage.getItem(clave)) || [];
      const nuevosRegistros = registrosGuardados.filter(registro => registro.numero !== numero);
      localStorage.setItem(clave, JSON.stringify(nuevosRegistros));
  });
}

function editarRegistro(boton) {
  const fila = boton.closest('tr');
  const celdas = fila.getElementsByTagName('td');

  document.getElementById("numero").value = celdas[0].textContent;
  document.getElementById("area").value = celdas[1].textContent;
  document.getElementById("descripcion").value = celdas[2].textContent;
  document.getElementById("proveedor").value = celdas[3].textContent;
  document.getElementById("responsable").value = celdas[4].textContent;
  document.getElementById("fechaVencimiento").value = celdas[5].textContent;
  document.getElementById("observacion").value = celdas[6].textContent;

  const procesoSelect = celdas[8].querySelector('select');
  const procesoValue = procesoSelect.value;

  document.querySelector('button[type="button"]').onclick = function() {
      celdas[0].textContent = document.getElementById("numero").value;
      celdas[1].textContent = document.getElementById("area").value;
      celdas[2].textContent = document.getElementById("descripcion").value;
      celdas[3].textContent = document.getElementById("proveedor").value;
      celdas[4].textContent = document.getElementById("responsable").value;
      celdas[5].textContent = document.getElementById("fechaVencimiento").value;
      celdas[6].textContent = document.getElementById("observacion").value;

      procesoSelect.value = procesoValue; 

      document.getElementById("numero").value = '';
      document.getElementById("area").value = 'CALIDAD';
      document.getElementById("descripcion").value = '';
      document.getElementById("proveedor").value = '';
      document.getElementById("responsable").value = 'PERLA SOTELO';
      document.getElementById("fechaVencimiento").value = '';
      document.getElementById("observacion").value = '';
  }
}

function culminarRegistro() {
  const registros = [];
  const filas = document.querySelectorAll('#tablaRegistros tbody tr');
  
  filas.forEach(fila => {
      const celdas = fila.getElementsByTagName('td');
      const estadoProceso = celdas[8].querySelector('select').value; 
      registros.push({
          numero: celdas[0].textContent,
          area: celdas[1].textContent,
          descripcion: celdas[2].textContent,
          proveedor: celdas[3].textContent,
          responsable: celdas[4].textContent,
          fechaVencimiento: celdas[5].textContent,
          observacion: celdas[6].textContent,
          estadoProceso: estadoProceso 
      });
  });

  clavesRegistros.forEach((clave) => {
      localStorage.setItem(clave, JSON.stringify(registros));
  });
  alert('Registros guardados correctamente!');
}

function imprimirTabla() {
  const tabla = document.getElementById("tablaRegistros");
  const tablaSinAcciones = tabla.cloneNode(true);

  const thAcciones = tablaSinAcciones.querySelector('th:last-child');
  const tdAcciones = tablaSinAcciones.querySelectorAll('td:last-child');

  if (thAcciones) thAcciones.remove();
  tdAcciones.forEach(td => td.remove());

  const tablaHTML = tablaSinAcciones.outerHTML;
  const ventanaImpresion = window.open('', '', 'height=600,width=800');
  ventanaImpresion.document.write('<html><head><title>Impresión de Registros</title>');
  ventanaImpresion.document.write('<style>table { width: 100%; border-collapse: collapse; }');
  ventanaImpresion.document.write('th, td { padding: 8px; text-align: left; border: 1px solid #ddd; font-size: 14px; }');
  ventanaImpresion.document.write('th { background-color: #f4f4f4; font-weight: bold; }');
  ventanaImpresion.document.write('</style></head><body>');
  ventanaImpresion.document.write('<h1>Registros Ingresados</h1>');
  ventanaImpresion.document.write(tablaHTML);
  ventanaImpresion.document.write('');
  ventanaImpresion.document.close();
  ventanaImpresion.print();
}

function exportarExcel() {
  const tabla = document.getElementById("tablaRegistros");
  const tablaSinAcciones = tabla.cloneNode(true);
  const thAcciones = tablaSinAcciones.querySelector('th:last-child');
  const tdAcciones = tablaSinAcciones.querySelectorAll('td:last-child');

  if (thAcciones) thAcciones.remove();
  tdAcciones.forEach(td => td.remove());

  const wb = XLSX.utils.table_to_book(tablaSinAcciones, { sheet: "Registros" });
  XLSX.writeFile(wb, "registroreporte.xlsx");
}

function filtrarRegistros() {
  const filtros = {
      'PERLA SOTELO': document.getElementById("filterPerla").checked,
      'ANDRES MARTINEZ': document.getElementById("filterAndres").checked,
      'MARIA HERRERA': document.getElementById("filterMaria").checked,
      'ISMAEL RIVAS': document.getElementById("filterIsmael").checked,
      'DANIEL ROJAS': document.getElementById("filterDaniel").checked,
      'DEYANIRA TORRES': document.getElementById("filterDeyanira").checked
  };

  const tabla = document.getElementById("tablaRegistros").getElementsByTagName('tbody')[0];
  const filas = tabla.getElementsByTagName('tr');

  for (let i = 0; i < filas.length; i++) {
      const celdas = filas[i].getElementsByTagName('td');
      const responsable = celdas[4].textContent.trim();

      if (filtros[responsable] || Object.values(filtros).every(val => !val)) {
          filas[i].style.display = ""; 
      } else {
          filas[i].style.display = "none"; 
      }
  }
}

function mostrarNotificacion(mensaje) {
if (Notification.permission === "granted") {
    new Notification("Recordatorio", {
        body: mensaje,
        icon: 'imagen/logo.jpeg'
    });
} else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            mostrarNotificacion(mensaje);
        }
    });
}
}
function verificarFechas() {
const filas = document.querySelectorAll('#tablaRegistros tbody tr');
const hoy = new Date();

filas.forEach(fila => {
    const fechaVencimiento = new Date(fila.cells[5].textContent); 
    const diasRestantes = Math.floor((fechaVencimiento - hoy) / (1000 * 3600 * 24));

    if (diasRestantes === 14 || diasRestantes === 7 || diasRestantes === 4) {
        const mensaje = `El registro número ${fila.cells[0].textContent} está a ${diasRestantes} días de vencer.`;
        mostrarNotificacion(mensaje);
    }
});
}

setInterval(verificarFechas, 24 * 60 * 60 * 1000); 
