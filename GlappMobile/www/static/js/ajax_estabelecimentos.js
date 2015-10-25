/* global google */
var DialogModalMapa;
var centroMapa = {lat: -23.5505200, lng: -46.6333090};
var map, geocoder, directionsDisplay, directionsService, marker, infoWindow, infoWindowEvent;
var listaObj = $("#lista-estabelecimento");
var btnPesquisar = $("#btn-pesquisar");

var ativarCollapsible = function () {
    $('.collapsible').collapsible({
        accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
};

var anexarMensagem = function (marker, conteudo) {
    if (infoWindow === undefined) {
        infoWindow = new google.maps.InfoWindow({maxWidth: 400, content: conteudo});
        infoWindowEvent = google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(marker.get('map'), marker);
        });
    } else {
        infoWindow.close();
        infoWindow.setContent(conteudo);
    }

};

var inserirMarcador = function (posicao, titulo, informacao) {
    var icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    var mapAux = map;
    if (marker === undefined) {
        marker = new google.maps.Marker({
            title: titulo,
            map: mapAux,
            position: posicao,
            icon: icon
        });
    } else {
        marker.setTitle(titulo);
        marker.setPosition(posicao);
        marker.setIcon(icon);
        marker.setMap(mapAux);
    }

    anexarMensagem(marker, informacao);
};

var recarregarMapa = function (id, latLng, objDescricao) {
    $('#map').appendTo('#mapContainer-' + id);
    var mapParentWidth = $('#mapContainer-' + id).width();
    $('#map').width(mapParentWidth * 0.999);
    $('#map').height(mapParentWidth * 0.999);
    var tituloMarcador = objDescricao.nome + ": " + objDescricao.unidade;
    var informacaoBalao = "<div><p>" + tituloMarcador + "</p></div>";
    inserirMarcador(latLng, tituloMarcador, informacaoBalao);
    google.maps.event.trigger(map, "resize");
    map.setCenter(latLng);
};

var renderizarLista = function (dadosRecebidos) {
    dadosRecebidos.forEach(function (estabelecimento) {
        var li = $('<li id="' + estabelecimento.idEmpresa + '"></li>');
        var div1 = $('<div class="collapsible-header"><i class="material-icons">business</i>' + estabelecimento.nome + ' -> ' + estabelecimento.unidade + '</div>');
        var div2 = $('<div class="collapsible-body"></div>');
        var conteudo = "";
        conteudo += '<p>Site: ' + estabelecimento.site + '</p>';
        conteudo += '<a class="waves-effect waves-light btn modal-trigger btn-mapa" href="#modal-mapa">Modal</a>';
        conteudo += '<input type="hidden" name="latitude" value="' + estabelecimento.latitude + '"  />';
        conteudo += '<input type="hidden" name="longitude" value="' + estabelecimento.longitude + '"  />';
        conteudo += '<input type="hidden" name="id" value="' + estabelecimento.idEmpresa + '"  />';
        conteudo += '<input type="hidden" name="nome" value="' + estabelecimento.nome + '"  />';
        conteudo += '<input type="hidden" name="unidade" value="' + estabelecimento.unidade + '"  />';
        conteudo += '<div id="mapContainer-' + estabelecimento.idEmpresa + '">';
        conteudo += '</div>';
        div2.html(conteudo);
        li.append(div1);
        li.append(div2);
        listaObj.append(li);
    });
};

var obterInformacoesEstabelecimento = function (e) {
    var divPai = $(e.target).parent("div");
    var id = divPai.find("input[name='id']").val();
    var lat = parseFloat(divPai.find("input[name='latitude']").val());
    var lng = parseFloat(divPai.find("input[name='longitude']").val());
    var nome = divPai.find("input[name='nome']").val();
    var unidade = divPai.find("input[name='unidade']").val();
    var objDescricao = {nome: nome, unidade: unidade};
    var objLatLng = {lat: lat, lng: lng};
    recarregarMapa(id, objLatLng, objDescricao);
};


//PARTE DE CONSULTA ESTABELECIMENTO
var buscarNomeEstabelecimento = function (termoPesquisado) {
    $.getJSON(URL + "/estabelecimento/procura/", {
        "campo": "nome",
        "valor": termoPesquisado
    })
            .success(renderizarLista)
            .then(ativarCollapsible)
            .then(vincularEventos)
            ;
};
var buscarIdEstabelecimento = function (idEstabelecimento) {
    $.getJSON(URL + "/estabelecimento/" + idEstabelecimento)
            .success(renderizarLista)
            .then(ativarCollapsible)
            .then(vincularEventos)
            ;
};
var buscarTodosEstabelecimentos = function () {
    $.getJSON(URL + "/estabelecimento/all")
            .success(renderizarLista)
            .then(ativarCollapsible)
            .then(vincularEventos)
            ;
};
var obterTermoPesquisado = function (e) {
    var termo = $("#txt-pesquisa").val();
    if (termo === "") {
        buscarTodosEstabelecimentos();
    } else if (isNaN(termo)) {
        buscarNomeEstabelecimento(termo);
    } else {
        buscarIdEstabelecimento(termo);
    }

};

var vincularEventos = function () {
    var btnMapa = $(".btn-mapa");
    btnMapa.on("click", obterInformacoesEstabelecimento);
    btnPesquisar.on("click", obterTermoPesquisado);
};

var initialize = function () {

    directionsService = new google.maps.DirectionsService();
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: centroMapa
    });
    var rendererOptions = {
        map: map,
        suppressMarkers: true
    };

};

var inicializarPagina = function () {
    //buscarEstabelecimentos();
    initialize();
    vincularEventos();
};

inicializarPagina();
