//Luxon
var DateTime = luxon.DateTime;

const tituloInput = document.querySelector('#titulo');
const detallesInput = document.querySelector('#detalles');

const contenedorNotas = document.querySelectorAll('#notas');

const crearNota = document.querySelectorAll('#crear-nota');

const notasElim = document.querySelectorAll('.notasBorradas')


let notas = [];
let notasEstacion = [];
let notasEliminadas = [];
let notasEliminadasEstacion = [];

// Eventos
eventListeners();
function eventListeners() {
    tituloInput.addEventListener('change', datosNota);
    detallesInput.addEventListener('change', datosNota);

    crearNota.forEach(nota => {
        nota.addEventListener('click', agregarNota);
    })

    document.addEventListener('DOMContentLoaded', () => {
        notas = JSON.parse(localStorage.getItem('notasCreadas')) || [];
        notasEliminadas = JSON.parse(localStorage.getItem('notasEliminadas')) || [];
        verificacionPrevia()
    });
}

const notaObj = {
    titulo: '',
    creadaPor: '',
    fecha: '',
    hora: '',
    estacion: '',
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
        mostrarError('Ambos campos son obligatorios')
    } else {
        notaObj.id = Date.now();
        verificacionPrevia()
    }
}

function verificacionPrevia() {
    //Para que al eliminar nota no me imprima el objeto vacio
    const { titulo, detalles } = notaObj
    if (titulo === '' || detalles === '') {

    } else {

        //Agrego el nombre de la estacion al objeto
        crearNota.forEach(nota => {
            notaObj.estacion = nota.value
        })
        //Agrego hora y fecha a la nota creada, con la libreria luxon
        const horaluxon = (DateTime.now().toJSDate())
        const hora = String(horaluxon).slice(15, 24)
        notaObj.hora = `${hora}`;
        notaObj.fecha = `${DateTime.now().toLocaleString()}`;
        const notaO = { ...notaObj }
        notas = [...notas, notaO]

        localStorage.setItem('notasCreadas', JSON.stringify(notas));
    }

    //Para imprimir cada nota en la estacion que corresponde
    contenedorNotas.forEach(contenedor => {
        crearNota.forEach(nota => {
            if (contenedor.classList.contains(nota.value)) {
                const coincide = nota.value
                notasEstacion = notas.filter(nota => nota.estacion === coincide)
                notasEliminadasEstacion = notasEliminadas.filter((nota) => nota.estacion === coincide)
                imprimirNotaHTML()
                notasBorradasHTML()
            }
        })
    })
}

function imprimirNotaHTML() {

    limpiarHTML();

    notasEstacion.forEach((nota) => {
        const { titulo, creadaPor, fecha, hora, detalles, id } = nota;

        const divNota = document.createElement('div');
        divNota.classList.add('notas');
        divNota.dataset.id = id;

        const tituloParrafo = document.createElement('h3');
        tituloParrafo.innerHTML = `Titulo: ${titulo}`;

        const creadaPorParrafo = document.createElement('p');
        creadaPorParrafo.classList.add('fs-5')
        creadaPorParrafo.innerHTML = `<span>Creada por: </span> ${creadaPor}`;

        const fechaParrafo = document.createElement('p');
        fechaParrafo.classList.add('fs-5')
        fechaParrafo.innerHTML = `<span>Fecha: </span> ${fecha}`;

        const horaParrafo = document.createElement('p');
        horaParrafo.classList.add('fs-5')
        horaParrafo.innerHTML = `<span>Hora: </span> ${hora}`;

        const detallesParrafo = document.createElement('p');
        detallesParrafo.classList.add('detalles', 'fs-4')
        detallesParrafo.innerHTML = `<span>Detalles: </span> ${detalles}`;

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

        contenedorNotas.forEach(contenedor => {
            contenedor.appendChild(divNota);
        })
    });

    reiniciarFormulario();
    reiniciarObjeto();
}


function eliminarNota(id) {
    //Uso de la libreria sweetalert2 para borrar notas
    Swal.fire({
        title: '¿Seguro que querés eliminar la nota?',
        text: "La nota se va a eliminar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, borrar nota'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('notasCreadas'); //Remuevo el array entero del LS

            let notasEliminadasArray = notas.filter(nota => nota.id == id)
            notasEliminadas = notasEliminadas.concat(notasEliminadasArray)
            notas = notas.filter(nota => nota.id !== id)

            localStorage.setItem('notasCreadas', JSON.stringify(notas)); //Seteo el nuevo array ya sin la nota borrada
            localStorage.setItem('notasEliminadas', JSON.stringify(notasEliminadas)); //Seteo el nuevo array con la nota borrada

            verificacionPrevia()
        }
    })
}

function notasBorradasHTML() {

    limpiarHTMLNotasBorradas();

    //Array para hacer el acordeon dinamico, hasta 19 notas pueden crearse por estacion
    const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'sSeven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Furteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    let i = 0
    notasEliminadasEstacion.forEach((nota) => {
        i++
        const { titulo, fecha, detalles } = nota;
        const divAcordeon = document.createElement('div')

        //Accordion de Bootstrap implementado de forma dinamica
        divAcordeon.innerHTML = `
            <div class="accordion" id="accordionPanelsStayOpenExample">
             <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-heading${numbers[i]}">
                <button class="accordion-button collapsed icono-user" type="button" data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapse${numbers[i]}" aria-expanded="false"
                  aria-controls="panelsStayOpen-collapse${numbers[i]}">
                  <h4 class="ms-4">${titulo}</h4>
                </button>
              </h2>
              <div id="panelsStayOpen-collapse${numbers[i]}" class="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-heading${numbers[i]}">
                <div class="accordion-body">
                <span>Fecha: </span> ${fecha}
                <span>Detalles: </span> ${detalles}
                </div>
              </div>
             </div>
            </div>`

        notasElim.forEach(elim => {
            elim.appendChild(divAcordeon)
        })
    })

    //Borro cada 5 dias el item mas antiguo del array de notas eliminadas, dependiendo el largo del array
    //Equivalente a 5 dias en ms 432000000
    setInterval(() => {
        localStorage.removeItem('notasEliminadas')
        const notasEliminadasLength = notasEliminadas.length
        switch (true) {
            case (notasEliminadasLength >= 20):
                notasEliminadas = notasEliminadas.slice(5, notasEliminadasLength)
                break;
            case (notasEliminadasLength >= 10):
                notasEliminadas = notasEliminadas.slice(2, notasEliminadasLength)
                break;
            case (notasEliminadasLength >= 5):
                notasEliminadas = notasEliminadas.slice(1, notasEliminadasLength)
                break;
            default:
                break;
        }
        localStorage.setItem('notasEliminadas', JSON.stringify(notasEliminadas));
    }, 432000000);
}


function reiniciarFormulario() {
    tituloInput.value = ""
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
    const errorDiv = document.querySelector(".error-campos");
    const error = document.createElement("div");
    error.classList.add("error")
    error.innerHTML = `${mensaje} `;

    errorDiv.appendChild(error);
    setTimeout(() => {
        errorDiv.removeChild(error);
    }, 3000);
}

function limpiarHTML() {
    contenedorNotas.forEach(contenedor => {
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }
    })
}

function limpiarHTMLNotasBorradas() {
    notasElim.forEach(eliminadas => {
        while (eliminadas.firstChild) {
            eliminadas.removeChild(eliminadas.firstChild);
        }
    })
}

