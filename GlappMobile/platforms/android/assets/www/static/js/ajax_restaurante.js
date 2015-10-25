$(document).ready(function () {
    /* global google */
    var DialogModalMapa;
    var centroMapa = {lat: -23.5505200, lng: -46.6333090};
    var map, geocoder, directionsDisplay, directionsService, marker, infoWindow, infoWindowEvent;
    var listaObj = $("#lista-restaurante");
    var btnPesquisar = $("#btn-pesquisar");

    var ativarCollapsible = function () {
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };

    var renderizarLista = function (dadosRecebidos) {
        listaObj.html('');
        dadosRecebidos.forEach(function (restaurante) {
            var li = $('<li></li>');
            var div1 = $('<div class="collapsible-header"><i class="material-icons">business</i>' + restaurante.nome + '</div>');
            var div2 = $('<div class="collapsible-body"></div>');
            var conteudo = "";
            conteudo += "<p>Site: " + restaurante.site + "</p>";
            conteudo += '<div class="row center"><a class="waves-effect waves-light  btn btn-mapa"><i class="material-icons right">navigation</i>Mostrar mapa</a></div>';
            conteudo += '<input type="hidden" name="latitude" value="' + restaurante.latitude + '"  />';
            conteudo += '<input type="hidden" name="longitude" value="' + restaurante.longitude + '"  />';
            conteudo += '<input type="hidden" name="id" value="' + restaurante.idEmpresa + '"  />';
            conteudo += '<input type="hidden" name="nome" value="' + restaurante.nome + '"  />';
            conteudo += '<div id="mapContainer-' + restaurante.idEmpresa + '">';
            conteudo += '</div>';
            div2.html(conteudo);
            li.append(div1);
            li.append(div2);
            listaObj.append(li);
        });
    };

    var buscarNomeRestaurante = function (termoPesquisado) {
        $.getJSON(URL + "/restaurante/procura/", {
            "campo": "nome",
            "valor": termoPesquisado
        })
                .success(renderizarLista)
                .then(ativarCollapsible)
                .then(vincularEventos)
                ;
    };

    var buscarIdRestaurante = function (idRestaurante) {
        $.getJSON(URL + "/restaurante/" + idRestaurante)
                .success(renderizarLista)
                .then(ativarCollapsible)
                .then(vincularEventos)
                ;
    };

    var buscarTodosRestaurantes = function () {

        $.getJSON(URL + "/restaurante/all")
                .success(renderizarLista)
                .then(ativarCollapsible)
                .then(vincularEventos)
                ;
    };

    var obterTermoPesquisado = function (e) {

        var termo = $("#txt-pesquisa").val();
        if (termo === "") {
            buscarTodosRestaurantes();
        } else if (isNaN(termo)) {
            buscarNomeRestaurante(termo);
        } else {
            buscarIdRestaurante(termo);
        }

    };

    var vincularEventos = function () {
        console.log("YEs");
        var btnMapa = $(".btn-mapa");
        console.log(btnMapa);
        btnMapa.on("click", obterInformacoesRestaurante);
        btnPesquisar.on("click", obterTermoPesquisado);
    };

    var inicializarPagina = function () {
        initialize();
        vincularEventos();
        //buscarTodosProdutos();
    };

    //GOOGLE MAPS
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

        //inicializarPagina();
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

    var obterInformacoesRestaurante = function (e) {
        console.log('YesResta');
        var divPai = $(e.currentTarget).parents("div.collapsible-body");
        var id = divPai.find("input[name='id']").val();
        var lat = parseFloat(divPai.find("input[name='latitude']").val());
        var lng = parseFloat(divPai.find("input[name='longitude']").val());
        var nome = divPai.find("input[name='nome']").val();
        var objDescricao = {nome: nome};
        var objLatLng = {lat: lat, lng: lng};
        recarregarMapa(id, objLatLng, objDescricao);
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

    inicializarPagina();
});