window.onload = cogerBoton();

fechaFinAPI = new Date("03-07-2021");
fechaInicioAPI = new Date("01-13-2020");

function llamadaApi(){
    fetch('https://api.covidtracking.com/v1/us/daily.json')
    .then(response => response.json())
    .then(jsonCargado);
}

function cogerBoton(){
    let btnConsultar = document.getElementById("consultarFecha");
    btnConsultar.addEventListener("click",logicaBtnConsulta);
}

function logicaBtnConsulta(){
    
    let fechaConsulta = document.getElementById("fechaConsulta").value;
    if(fechaConsulta!==""){
        let fecha = new Date(fechaConsulta);
        let fechaSinHoras = quitarHorasFecha(fecha);
        console.log(fechaSinHoras);
        if (fechaSinHoras>=fechaFinAPI || fechaSinHoras<fechaInicioAPI) {
            alert("Introduce una fecha válida (entre el 13 de enero de 2020 y el 07 de marzo de 2021");
        } else {
            llamadaApi();
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
    console.log("Encontrado en índice: "+i);
    console.log(json[i].date);
    console.log(fechaNumerica);
    console.log("Nº de muertes en ese día   :"+json[i].deathIncrease);
    console.log("Nº de hospitalizados en ese momento:"+json[i].hospitalizedCurrently);
    let derHTML="";
    derHTML = "Nº de hospitalizados en ese momento: "+json[i].hospitalizedCurrently;

    let htmlDer = document.getElementById("columnaDer");
    htmlDer.innerHTML = derHTML;

}

function cambiarFormatoFecha(fecha) {
    // Elimina los guiones de la fecha y devuelve el nuevo formato
    return fecha.replace(/-/g, '');
  }

function quitarHorasFecha(fecha){
    let fechaSinHoras = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    console.log(fechaSinHoras);
}