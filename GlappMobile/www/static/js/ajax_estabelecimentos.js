$(document).ready(function () {

    /* global google */
    var DialogModalMapa;
    var centroMapa = {lat: -23.5505200, lng: -46.6333090};
    var map, geocoder, directionsDisplay, directionsService, marker, markerUsuario, infoWindow, infoWindowEvent, infoWindowUsuario, infoWindowEventUsuario;
    var listaObj = $("#lista-estabelecimento");
    var btnPesquisar = $("#btn-pesquisar");


    var ativarCollapsible = function () {
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };

    var anexarMensagemUsuario = function (marker, conteudo) {
        if (infoWindowUsuario === undefined) {
            infoWindowUsuario = new google.maps.InfoWindow({maxWidth: 400, content: conteudo});
            infoWindowEventUsuario = google.maps.event.addListener(marker, 'click', function () {
                infoWindowUsuario.open(marker.get('map'), marker);
            });
        } else {
            infoWindowUsuario.close();
            infoWindowUsuario.setContent(conteudo);
        }
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
        listaObj.html('');
        dadosRecebidos.forEach(function (estabelecimento) {
            var li = $('<li id="' + estabelecimento.idEmpresa + '"></li>');
            var div1 = $('<div class="collapsible-header"><i class="material-icons">business</i>' + estabelecimento.nome + ' -> ' + estabelecimento.unidade + '</div>');
            var div2 = $('<div class="collapsible-body"></div>');
            var conteudo = "";
            conteudo += '<p>Site: ' + estabelecimento.site + '</p>';
            conteudo += '<div class="row center"><div class="col s12 m6"><a class="waves-effect waves-light  btn btn-mapa"><i class="material-icons right">navigation</i>Mostrar mapa</a></div>';
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

    var inserirMarcadorUsuario = function (posicao, titulo, informacao) {
        var icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        var mapAux = map;
        if (markerUsuario === undefined) {
            markerUsuario = new google.maps.Marker({
                title: titulo,
                map: mapAux,
                position: posicao,
                icon: icon
            });
        } else {
            markerUsuario.setTitle(titulo);
            markerUsuario.setPosition(posicao);
            markerUsuario.setIcon(icon);
            markerUsuario.setMap(mapAux);
        }

        anexarMensagemUsuario(markerUsuario, informacao);
    };

    var recarregarMapa = function (id, latLng, objDescricao) {
        if (directionsDisplay !== undefined) {
            directionsDisplay.setMap(null);
        }
        if (markerUsuario !== undefined) {
            markerUsuario.setMap(null);
        }
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

    function calcularRota(origemLatLng, destinoLatLng) {
        directionsService.route({
            origin: origemLatLng,
            destination: destinoLatLng,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);

            } else {
                console.log('Directions request failed due to ' + status);
            }
        });
    }

    var renderizarLista = function (dadosRecebidos) {
        listaObj.html('');
        dadosRecebidos.forEach(function (estabelecimento) {
            var li = $('<li id="' + estabelecimento.idEmpresa + '"></li>');
            var div1 = $('<div class="collapsible-header"><i class="material-icons">business</i>' + estabelecimento.nome + ' -> ' + estabelecimento.unidade + '</div>');
            var div2 = $('<div class="collapsible-body"></div>');
            var conteudo = "";
            conteudo += '<p>Site: ' + estabelecimento.site + '</p>';
            conteudo += '<div class="row center"><div class="col s12 m6" style="margin-top: 5px;"><a class="waves-effect waves-light  btn btn-mapa"><i class="material-icons right">location_on</i>Mostrar mapa</a></div><div class="col s12 m6" style="margin-top: 5px;"><a class="waves-effect waves-light  btn btn-rota"><i class="material-icons right">navigation</i>Traçar rota</a></div></div>';
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

    var tracarRota = function (e) {
        var informacoes = obterInformacoesEstabelecimento(e);
        navigator.geolocation.getCurrentPosition(exibirRota, null, {timeout: 10000, enableHighAccuracy: true});
    };

    var exibirRota = function (dados) {
        var latLng = {lat: dados.coords.latitude, lng: dados.coords.longitude};
        calcularRota(marker.getPosition(), latLng);
        inserirMarcadorUsuario(latLng, "Minha Posição", "<div><p>Minha Posição</p></div>");
    };

    var obterInformacoesEstabelecimento = function (e) {
        var divPai = $(e.currentTarget).parents("div.collapsible-body");
        var id = divPai.find("input[name='id']").val();
        var lat = parseFloat(divPai.find("input[name='latitude']").val());
        var lng = parseFloat(divPai.find("input[name='longitude']").val());
        var nome = divPai.find("input[name='nome']").val();
        var unidade = divPai.find("input[name='unidade']").val();
        var objDescricao = {nome: nome, unidade: unidade};
        var objLatLng = {lat: lat, lng: lng};
        return {id: id, objLatLng: objLatLng, objDescricao: objDescricao};
    };

    var mostrarEstabelecimento = function (e) {
        var informacoes = obterInformacoesEstabelecimento(e);
        recarregarMapa(informacoes.id, informacoes.objLatLng, informacoes.objDescricao);
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
        btnMapa.on("click", mostrarEstabelecimento);
        var btnRota = $(".btn-rota");
        btnRota.on("click", tracarRota);
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

        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    };


    var inicializarPagina = function () {
        //buscarEstabelecimentos();
        initialize();
        vincularEventos();
    };

    inicializarPagina();
});
