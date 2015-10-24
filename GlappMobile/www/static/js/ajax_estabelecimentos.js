/* global google */
var DialogModalMapa;
var centroMapa = {lat: -23.6796914, lng: -46.7526857};
var map, geocoder, directionsDisplay, directionsService;
var listaObj = $("#lista-estabelecimento");

var inserirMarcador = function (posicao, conteudo) {
    var icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    var mapAux = map;

    var marker = new google.maps.Marker({
        title: conteudo,
        map: mapAux,
        position: posicao,
        icon: icon
    });

    anexarMensagem(marker, conteudo);

};

var anexarMensagem = function (marker, conteudo) {
    //console.log("Chamado");
    var infowindow = new google.maps.InfoWindow({maxWidth: 400, content: conteudo});
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(marker.get('map'), marker);
    });
};

var recarregarMapa = function () {

    var mapParentWidth = $('#mapContainer').width();
    $('#map').width(mapParentWidth);
    $('#map').height(mapParentWidth * 0.5);
    google.maps.event.trigger(map, "resize");
    setTimeout(function () {
        map.setCenter(centroMapa);
    }, 500);
};


var initialize = function () {
    directionsService = new google.maps.DirectionsService();
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: centroMapa
    });
    var rendererOptions = {
        map: map,
        suppressMarkers: true
    };
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
};

var ativarCollapsible = function () {
    $('.collapsible').collapsible({
        accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
};

var renderizarLista = function (dadosRecebidos) {
    dadosRecebidos.forEach(function (estabelecimento) {
        var li = $('<li></li>');
        var div1 = $('<div class="collapsible-header"><i class="material-icons">business</i>' + estabelecimento.nome + ' -> ' + estabelecimento.unidade + '</div>');
        var div2 = $('<div class="collapsible-body"></div>');
        console.log(div2);
        var conteudo = "";
        conteudo += '<p>Site: ' + estabelecimento.site + '</p>';
        conteudo += '<a class="waves-effect waves-light btn modal-trigger" href="#modal-mapa">Modal</a>';
        div2.html(conteudo);
        li.append(div1);
        li.append(div2);
        listaObj.append(li);
    });
    DialogModalMapa = $("#modal-mapa");
    $('.modal-trigger').on("click", function () {
        DialogModalMapa.openModal();
        setTimeout(recarregarMapa, 500);
    });
};

var buscarEstabelecimentos = function () {

    $.getJSON(URL + "/estabelecimento/all")
            .success(renderizarLista)
            .then(ativarCollapsible)
            ;

};

var inicializarPagina = function () {
    buscarEstabelecimentos();
    initialize();
};

inicializarPagina();