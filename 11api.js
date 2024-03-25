window.onload = cogerBoton();

//Inicializo las fechas de comienzo y fin de la API para que podamos enseñar mensaje de error
//Aunque esto se podría haber hecho más fácilmente sacando el mensaje de error si no coincidía
//la búsqueda con ningún valor de la API
fechaFinAPI = new Date("03-07-2021");
fechaInicioAPI = new Date("01-13-2020");

function llamadaApi(){
    //Esta es la manera para invocar a la api a través de la función fetch
    //El resultado es llamar a la función jsonCargado
    //Esta función (llamadaApi) no se invoca hasta que no se pulta el botón. 
    fetch('https://api.covidtracking.com/v1/us/daily.json')
    .then(response => response.json())
    .then(jsonCargado);
}

function cogerBoton(){
    let btnConsultar = document.getElementById("consultarFecha");
    btnConsultar.addEventListener("click",logicaBtnConsulta);
}

async function pausaCodigo (){
    await new Promise(() => {
        setTimeout(() => {
                let ruedaCargando = document.getElementsByClassName("spinner-container")                
                for (let i = 0; i < ruedaCargando.length; i++) {
                    ruedaCargando[i].style.display = "none";
                }
                llamadaApi();
        }, 0.5*1000);
    });
}

function logicaBtnConsulta(){
    
    //Inicializamos el html para cuando hay más de una búsqueda y se vuelve a pulsar el botón, se reinicialice
    //los valores para que de mejor UX
    let htmlDer = document.getElementById("columnaDer");
    let derHTML="Nº de hospitalizados en ese momento: ";
    htmlDer.innerHTML = derHTML;

    let htmlCol3 = document.getElementById("columna3");
    let col3HTML = "Nº de Estados que aportaron datos ese día: ";
    htmlCol3.innerHTML = col3HTML;

    let htmlIzq = document.getElementById("columnaIzq");
    let izqHTML = "Nº de muertes en ese día: ";
    htmlIzq.innerHTML = izqHTML;
    //Primero verificamos con bucles if si las fechas están en el rango indicado
    //O incluso si se ha introducido fecha o no. 
    //Se ha tenido que hacer la función quitarHorasFecha para evitar error
    //Error de que sean dos fechas iguales pero las horas lo eviten. 
    //Cuando definimos fechaFinApi con new Date pone las horas a cero. a diferencia de cuando las 
    //Metemos por el input de fecha que le pone la hora que local
    let fechaConsulta = document.getElementById("fechaConsulta").value;
    if(fechaConsulta!==""){
        let fecha = new Date(fechaConsulta);
        let fechaSinHoras = quitarHorasFecha(fecha);
        if (fechaSinHoras>=fechaFinAPI || fechaSinHoras<fechaInicioAPI) {
            alert("Introduce una fecha válida (entre el 13 de enero de 2020 y el 07 de marzo de 2021");
        } else {
                let ruedaCargando = document.getElementsByClassName("spinner-container")
                for (let i = 0; i < ruedaCargando.length; i++) {
                    ruedaCargando[i].style.display = "block";
                }
                pausaCodigo();
        }
    } else {
        alert("Introduce una fecha");
    }
}

function jsonCargado(json){
    fechaConsulta = document.getElementById("fechaConsulta").value;
    let nuevaFecha = cambiarFormatoFecha(fechaConsulta);//Imprime la fecha "aaaammdd" como caracteres, NO números
    let fechaNumerica = parseFloat(nuevaFecha);
    
    let i=-1; //"-1" porque antes de entrar en la condición del while ya incrementa el contador. 
    do {
        console.log("Buscando datos");
        i++;
        
    } while (fechaNumerica !== json[i].date );
    
    let numHosp = json[i].hospitalizedCurrently;
    let numHospSalida = muestraDato("columna3", numHosp);
    
    let htmlDer = document.getElementById("columnaDer");
    let derHTML="Nº de hospitalizados en ese momento: "+numHospSalida;
    htmlDer.innerHTML = derHTML;

    let numEstados = json[i].states;
    let numEstadosSalida = muestraDato("columna3", numEstados);

    let htmlCol3 = document.getElementById("columna3");
    let col3HTML = "Nº de Estados que aportaron datos ese día: "+numEstadosSalida;
    htmlCol3.innerHTML = col3HTML;
    
    let numMuertes = json[i].deathIncrease;
    let numMuertesSalida = muestraDato("columnaIzq", numMuertes);

    let htmlIzq = document.getElementById("columnaIzq");
    let izqHTML = "Nº de muertes en ese día: "+numMuertesSalida;
    htmlIzq.innerHTML = izqHTML;

}

function cambiarFormatoFecha(fecha) {
    // Elimina los guiones de la fecha y devuelve el nuevo formato
    return fecha.replace(/-/g, '');
  }

function quitarHorasFecha(fecha){
    let fechaSinHoras = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    return fechaSinHoras;
}

function muestraDato(nombreElemento, varApi){
    //Nombre elemento cadena caracteres del "id" en html
    //dato igual da error al no tener que ser cadena de caracteres
    let inicioHTML="";
    let htmlSalida = document.getElementById(nombreElemento);
    if (varApi !== null) {
        inicioHTML = varApi;
        htmlSalida.innerHTML = inicioHTML;
    } else {
        inicioHTML = "0";
    }
    return inicioHTML;
}