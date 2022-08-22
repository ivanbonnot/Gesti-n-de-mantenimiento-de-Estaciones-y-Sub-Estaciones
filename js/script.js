//const { DateTime } = require("luxon");

//import { DateTime } from "luxon";


const tituloInput = document.querySelector('#titulo');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const detallesInput = document.querySelector('#detalles');

const contenedorNotas = document.querySelector('#notas');

const crearNota = document.querySelector('#crear-nota');

let notas = [];

//console.log(DateTime.now().setZone('America/New_York').minus({weeks:1}).endOf('day').toISO())
//console.log(DateTime.now().ts())

// Eventos
eventListeners();
function eventListeners() {
    tituloInput.addEventListener('change', datosNota);
    fechaInput.addEventListener('change', datosNota);
    horaInput.addEventListener('change', datosNota);
    detallesInput.addEventListener('change', datosNota);
    crearNota.addEventListener('click', agregarNota)
}

const notaObj = {
    titulo: '',
    creadaPor: '',
    fecha: '',
    hora: '',
    detalles: ''
}

function datosNota(e) {
    //  console.log(e.target.name) // Obtener el Input
    notaObj[e.target.name] = e.target.value;

}

function agregarNota(e) {
    e.preventDefault();

    const { titulo, detalles } = notaObj
    if (titulo === '' || detalles === '') {
        mostrarError('Todos los campos son obligatorios')
    } else {
        notaObj.id = Date.now();
        imprimirNotaHTML()
    }
}

function imprimirNotaHTML() {

    //Para que al eliminar nota no me imprima el objeto vacio
    const { titulo, detalles } = notaObj
    if (titulo === '' || detalles === '') {
    } else {
        const notaO = { ...notaObj }
        notas = [...notas, notaO]
    }

    limpiarHTML();

    notas.forEach((nota) => {
        const { titulo, creadaPor, fecha, hora, detalles, id } = nota;

        const divNota = document.createElement('div');
        divNota.classList.add('cita', 'p-3');
        divNota.dataset.id = id;

        // scRIPTING DE LOS ELEMENTOS...
        const tituloParrafo = document.createElement('h2');
        tituloParrafo.classList.add('card-title', 'font-weight-bolder');
        tituloParrafo.innerHTML = `${titulo}`;

        const creadaPorParrafo = document.createElement('p');
        creadaPorParrafo.innerHTML = `<span class="font-weight-bolder fs-5">Creada por: </span> ${creadaPor}`;

        const fechaParrafo = document.createElement('p');
        fechaParrafo.innerHTML = `<span class="font-weight-bolder fs-5">Fecha: </span> ${fecha}`;

        const horaParrafo = document.createElement('p');
        horaParrafo.innerHTML = `<span class="font-weight-bolder fs-5">Hora: </span> ${hora}`;

        const detallesParrafo = document.createElement('p');
        detallesParrafo.innerHTML = `<span class="font-weight-bolder">Detalles: </span> ${detalles}`;

        // Agregar un botón de eliminar...
        const btnEliminar = document.createElement('button');
        btnEliminar.onclick = () => eliminarNota(id); // añade la opción de eliminar
        btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
        btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'

        // Agregar al HTML
        divNota.appendChild(tituloParrafo);
        divNota.appendChild(creadaPorParrafo);
        divNota.appendChild(fechaParrafo);
        divNota.appendChild(horaParrafo);
        divNota.appendChild(detallesParrafo);
        divNota.appendChild(btnEliminar)

        contenedorNotas.appendChild(divNota);
    });

    reiniciarFormulario();
    reiniciarObjeto();
}


function eliminarNota(id) {
    console.log(id)
    notas = notas.filter(nota => nota.id !== id)
    console.log(notas)
    imprimirNotaHTML()
}

function limpiarHTML() {
    while (contenedorNotas.firstChild) {
        contenedorNotas.removeChild(contenedorNotas.firstChild);
    }
}

function reiniciarFormulario() {
    tituloInput.value = ""
    fechaInput.value = ""
    horaInput.value = ""
    detallesInput.value = ""

}

function reiniciarObjeto() {
    notaObj.titulo = '';
    notaObj.creadaPor = '';
    notaObj.fecha = '';
    notaObj.hora = '';
    notaObj.detalles = '';
}

function mostrarError(mensaje) {
    const errorDiv = document.querySelector(".error");
    const error = document.createElement("div");
    error.innerHTML = `${mensaje} `;

    errorDiv.appendChild(error);
    setTimeout(() => {
        errorDiv.removeChild(error);
    }, 3000);
}