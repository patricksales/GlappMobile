/* global google */
var DialogModalMapa;
var centroMapa = {lat: -23.5505200, lng: -46.6333090};
var map, geocoder, directionsDisplay, directionsService, marker, infoWindow, infoWindowEvent;
var listaObj = $("#lista-estabelecimento");

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

    var anexarMensagem = function (marker, conteudo) {
        //console.log("Chamado");
        var infowindow = new google.maps.InfoWindow({maxWidth: 400, content: conteudo});
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(marker.get('map'), marker);
        });
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
        //conteudo += '<div id="map-' + estabelecimento.idEmpresa + '"></div>';
        conteudo += '</div>';
        div2.html(conteudo);
        li.append(div1);
        li.append(div2);
        listaObj.append(li);
    });
};

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

    $(".btn-mapa").on("click", function () {
        var id = $(this).parent("div").find("input[name='id']").val();
        var divPai = $(this).parent("div");
        var lat = parseFloat(divPai.find("input[name='latitude']").val());
        var lng = parseFloat(divPai.find("input[name='longitude']").val());
        var nome = divPai.find("input[name='nome']").val();
        var unidade = divPai.find("input[name='unidade']").val();
        var objDescricao = {nome: nome, unidade: unidade};
        var objLatLng = {lat: lat, lng: lng};
        recarregarMapa(id, objLatLng, objDescricao);
    });
};

var inicializarPagina = function () {
    buscarEstabelecimentos();
    initialize();
};

    /*var buscarEstabelecimentos = function () {
     $.getJSON(URL + "/estabelecimento/all")
     .success(renderizarLista)
     .then(ativarCollapsible)
     .then(vincularEventos)
     ;
     };*/

    var vincularEventos = function () {

        $(".btn-mapa").on("click", function () {
            var id = $(this).parent("div").find("input[name='id']").val();
            var lat = parseFloat($(this).parent("div").find("input[name='latitude']").val());
            var lng = parseFloat($(this).parent("div").find("input[name='longitude']").val());
            var objLatLng = {lat: lat, lng: lng};
            initialize(id, objLatLng);
            recarregarMapa(id, objLatLng);
        });
    };

    var inicializarPagina = function () {
        //buscarEstabelecimentos();
        vincularEventos();
        vincularEventosClick();
    };



//PARTE DE CONSULTA ESTABELECIMENTO

    var btnPesquisar = $("#btn-pesquisar");

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

    var vincularEventosClick = function () {
        btnPesquisar.on("click", obterTermoPesquisado);
    };

    inicializarPagina();
});
