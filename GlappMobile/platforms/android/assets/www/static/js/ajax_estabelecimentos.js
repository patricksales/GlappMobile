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

var recarregarMapa = function (id, latLng) {

    var mapParentWidth = $('#mapContainer-' + id).width();
    $('#map-' + id).width(mapParentWidth * 0.999);
    $('#map-' + id).height(mapParentWidth * 0.999);
    var textoInformação = "<div><p>Teste</p></div>";
    inserirMarcador(latLng, textoInformação);
    google.maps.event.trigger(map, "resize");
    setTimeout(function () {
        map.setCenter(latLng);
    }, 500);
};


var initialize = function (id, latLng) {
    
    directionsService = new google.maps.DirectionsService();
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map-' + id), {
        zoom: 16,
        center: latLng
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
        var li = $('<li id="' + estabelecimento.idEmpresa + '"></li>');
        var div1 = $('<div class="collapsible-header"><i class="material-icons">business</i>' + estabelecimento.nome + ' -> ' + estabelecimento.unidade + '</div>');
        var div2 = $('<div class="collapsible-body"></div>');
        console.log(div2);
        var conteudo = "";
        conteudo += '<p>Site: ' + estabelecimento.site + '</p>';
        conteudo += '<a class="waves-effect waves-light btn modal-trigger btn-mapa" href="#modal-mapa">Modal</a>';
        conteudo += '<input type="hidden" name="latitude" value="' + estabelecimento.latitude + '"  />';
        conteudo += '<input type="hidden" name="longitude" value="' + estabelecimento.longitude + '"  />';
        conteudo += '<input type="hidden" name="id" value="' + estabelecimento.idEmpresa + '"  />';
        conteudo += '<div id="mapContainer-' + estabelecimento.idEmpresa + '">';
        conteudo += '<div id="map-' + estabelecimento.idEmpresa + '"></div>';
        conteudo += '</div>';
        div2.html(conteudo);
        li.append(div1);
        li.append(div2);
        listaObj.append(li);
    });
};

var buscarEstabelecimentos = function () {

    $.getJSON(URL + "/estabelecimento/all")
            .success(renderizarLista)
            .then(ativarCollapsible)
            .then(vincularEventos)
            ;

};

var vincularEventos = function () {

    $(".btn-mapa").on("click", function () {
        var id = $(this).parent("div").find("input[name='id']").val();
        var lat = parseFloat($(this).parent("div").find("input[name='latitude']").val());
        var lng = parseFloat($(this).parent("div").find("input[name='longitude']").val());
        console.log(id);
        console.log(lat);
        console.log(lng);
        var objLatLng = {lat: lat, lng: lng};
        initialize(id, objLatLng);
        recarregarMapa(id, objLatLng);
    });
};

var inicializarPagina = function () {
    buscarEstabelecimentos();
};

inicializarPagina();