(function(){

    if(window.jQuery == undefined){
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type","text/javascript");
        script_tag.setAttribute("src",
            "http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js");

        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                JscriptLoadHandler();
            }
        };
        } else {
            script_tag.onload = JscriptLoadHandler;
        }

        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

    }else{
        $ = window.jQuery;
        getMoment();
    }    
function JscriptLoadHandler() {
    
    $ = window.jQuery.noConflict(true);
    
    getMoment();
}      

function getMoment(){
    if(window.moment == undefined){
        console.log("workin");
        var csslink = $('<link>',{
            rel: "stylesheet", 
            type: "text/css", 
            href: "http://proximamente.mx/profin/indicadores/css/main.css"
        });

       csslink.appendTo('head');

        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.2/moment.min.js", function(){
            setGo();
        })
    }
    else{
        setGo();
    }

function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    
    moment = window.moment;
    // Call our main function
    setGo(); 
}
}



var indexOBJ = [
    {
        IPC:{
            source: "https://www.quandl.com/api/v3/datasets/YAHOO/INDEX_MXX.json?api_key=C7srT4xBhkDWB34YUHR-&start_date=",
            name: "IPC"
        },
        DJIA:{
            source:"https://www.quandl.com/api/v3/datasets/YAHOO/INDEX_DJI.json?api_key=C7srT4xBhkDWB34YUHR-&start_date=",
            name: "DOW"
        },
        SP:{
            source:"https://www.quandl.com/api/v3/datasets/CBOE/SP500IMPCOR.json?api_key=C7srT4xBhkDWB34YUHR-&start_date=",
            name: "S&P 500"
        },
        NSQ:{
            source:"https://www.quandl.com/api/v3/datasets/CHRIS/CME_NQ2.json?api_key=C7srT4xBhkDWB34YUHR-&start_date=",
            name: "NSQ"
        },
        DXZ:{
            source:"https://www.quandl.com/api/v3/datasets/ICE/DXZ2016.json?api_key=C7srT4xBhkDWB34YUHR-&start_date=",
            name: "DXZ6"
        }    
    }
]

function getPercentage(today, yesterday){

    var gain = ((today * 100)/yesterday)-100;
    var truncated = gain.toFixed(2);
    return truncated;

}

function getIndexes(value, name){
    $.ajax({
        type: "GET",
        url : value,
        success: function(datos){
            buildTable(datos, name);
        } 
    })

}

function buildTable(value, name){
    console.log(value);
    
    //Crea los elementos html
    var indexContainer = document.createElement('div');
    indexContainer.className="index";
    var indexName = document.createElement('h4');
    var indexImg = document.createElement('img');
    var indexP = document.createElement('p');
    var indexPercentage = document.createElement('p');
    var precio = "";
    var precioPrevio = "";
    //Hace append de la variable name a indexName(h4)
    $(indexName).html(name);

    
    //Si el índice es S&P
    if(value.dataset.dataset_code == "SP500IMPCOR"){
        precio =  value.dataset.data[0][1]; //-->precio de cierre de hoy
        precioPrevio = value.dataset.data[1][1]; //-->precio de cierre de ayer

        //Llama a la variable que calcula el porcentaje de pérdida o ganancia
        var percentageSP = getPercentage(precio, precioPrevio);
        //appendea el resultado
        $(indexPercentage).html(percentageSP + "%");

        //Si el porcentaje es negativo, agrega la clase red que lo pone en color rojo
        if(percentageSP<0){
            $(indexPercentage).addClass('red');
        }else{
            $(indexPercentage).removeClass('red').addClass('green');
        }

    }else{
        precio =  value.dataset.data[0][4];//-->precio de cierre
        precioPrevio = value.dataset.data[0][1];//-->precio de apertura
        
        //Llama a la variable que calcula el porcentaje de pérdida o ganancia
        var percentage = getPercentage(precio, precioPrevio);
        //appendea el resultado
        $(indexPercentage).html(percentage + "%");
        
        //Si el porcentaje es negativo, agrega la clase red que lo pone en color rojo
        if(percentage<0){
            $(indexPercentage).addClass('red');
        }
        else{
            $(indexPercentage).removeClass('red').addClass('green');
        }

    }

    //Incluye el precio (puntos) del índice del cierre de hoy y lo limita a 2 decimales
    $(indexP).html(precio.toFixed(2));


    //Si el precio(puntos) del cierre de hoy es menor al de ayer o al de apertura, asigna imagenes de flechas arriba o abajo
    if (precio < precioPrevio){
        indexImg.src = "http://proximamente.mx/profin/images/home/down.png";
        indexImg.alt = "down";
    }else if(precio > precioPrevio){
        indexImg.src = "http://proximamente.mx/profin/images/home/up.png";
        indexImg.alt = "up";
    }

    //Pega todos los elementos html al contenedor
    $(indexContainer).append(indexName, indexImg, indexP, indexPercentage);

    //Pega el contenedor al contenedor principal
    $('.indicadores').append(indexContainer);


}

function setGo(){

    //obtiene el arreglo del objeto indexOBJ
    var index = indexOBJ[0];

    //obtener fechas para pasar como parametros
    var time = moment().subtract(1,"days").format("YYYY-MM-DD");
    var timeMinus = moment().subtract(2,"days").format("YYYY-MM-DD");

    $.each(index, function(i, val){


        //Arma el string con las fechas
        var realValue = (val.source).toString() + timeMinus + "end_date=" +time;
        
        getIndexes(realValue, val.name);


    });
    
    //$('.indicadoresDate').append("Indicadores al: "+ time);
}
})();
/*$(document).ready(function(){
    setGo();
})*/

