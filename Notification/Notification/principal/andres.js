const claveRegistros = 'registrosArchivo6';
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
        nuevaFila.innerHTML = `
            <td>${numero}</td>
            <td>${area}</td>
            <td>${descripcion}</td>
            <td>${proveedor}</td>
            <td>${responsable}</td>
            <td>${fechaVencimiento}</td>
            <td>${observacion}</td>
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
        document.getElementById("numero").value = getNextNumero();
        document.getElementById("area").value = 'MANTENIMIENTO';
        document.getElementById("descripcion").value = '';
        document.getElementById("proveedor").value = '';
        document.getElementById("responsable").value = 'JUAN CARLOS ALMEYDA';
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
    const registrosGuardados = JSON.parse(localStorage.getItem(claveRegistros));
    if (registrosGuardados) {
        registrosGuardados.forEach(registro => {
            const tabla = document.getElementById("tablaRegistros").getElementsByTagName('tbody')[0];
            const nuevaFila = tabla.insertRow();
            nuevaFila.innerHTML = `
                <td>${registro.numero}</td>
                <td>${registro.area}</td>
                <td>${registro.descripcion}</td>
                <td>${registro.proveedor}</td>
                <td>${registro.responsable}</td>
                <td>${registro.fechaVencimiento}</td>
                <td>${registro.observacion}</td>
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
}
window.onload = cargarRegistros;
function eliminarRegistro(boton) {
    const fila = boton.closest('tr');
    fila.remove();
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

    document.querySelector('button[type="button"]').onclick = function() {
        celdas[0].textContent = document.getElementById("numero").value;
        celdas[1].textContent = document.getElementById("area").value;
        celdas[2].textContent = document.getElementById("descripcion").value;
        celdas[3].textContent = document.getElementById("proveedor").value;
        celdas[4].textContent = document.getElementById("responsable").value;
        celdas[5].textContent = document.getElementById("fechaVencimiento").value;
        celdas[6].textContent = document.getElementById("observacion").value;

        document.getElementById("numero").value = '';
        document.getElementById("area").value = 'MANTENIMIENTO';
        document.getElementById("descripcion").value = '';
        document.getElementById("proveedor").value = '';
        document.getElementById("responsable").value = 'JUAN CARLOS ALMEYDA';
        document.getElementById("fechaVencimiento").value = '';
        document.getElementById("observacion").value = '';
    }
}
function culminarRegistro() {
    const registros = [];
    const filas = document.querySelectorAll('#tablaRegistros tbody tr');
    
    filas.forEach(fila => {
        const celdas = fila.getElementsByTagName('td');
        const estadoProceso = celdas[7].querySelector('select').value;
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

    localStorage.setItem(claveRegistros, JSON.stringify(registros));
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
    XLSX.writeFile(wb, "registrosdemantenimiento.xlsx");
}
