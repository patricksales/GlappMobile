/* global google */

$(document).ready(function () {
    var centroMapa = {lat: -23.5505200, lng: -46.6333090};
    var listaObj = $("#lista-produto");
    var btnPesquisar = $("#btn-pesquisar");
    var arrayEstabelecimentoMarker = [];
    var map, geocoder, markerUsuario, idUsuario;
    var jsonResult;

    var ativarCollapsible = function () {
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };

    var renderizarLista = function (dadosRecebidos) {
        jsonResult = dadosRecebidos;
        listaObj.html('');
        dadosRecebidos.forEach(function (produto) {
            var li = $('<li></li>');
            var div1 = $('<div class="collapsible-header"><i class="material-icons">assignment_ind</i>' + produto.nome + ' -> ' + produto.marca + '</div>');
            var div2 = $('<div class="collapsible-body"></div>');
            var conteudo = "";
            conteudo += "<div><p>Ingredientes: " + produto.ingredientes + "<br>" + "Contem gluten: " + produto.contemGluten + "</p></div>";
            conteudo += '<div class="row center"><div class="col s12 m6" style="margin-top: 5px;"><a class="waves-effect waves-light  btn btn-mapa"><i class="right"><img id="btn-mapa-icone-localizacao" src="static/img/ic_place_white_18dp.png"/></i>Mostrar mapa</a></div>';
            conteudo += '<div class="row center"><div class="col s12"><div class="mapContainer" id="mapContainer-' + produto.idProduto + '"></div></div></div>';
            conteudo += '<input type="hidden" name="id" value="' + produto.idProduto + '" />';
            div2.html(conteudo);
            li.append(div1);
            li.append(div2);
            listaObj.append(li);
        });
    };

    var buscarNomeProduto = function (termoPesquisado) {
        $.getJSON(URL + "/produto/procura/", {
            "campo": "nome",
            "valor": termoPesquisado
        })
                .success(renderizarLista)
                .then(ativarCollapsible)
                .then(vincularEventos)
                ;
    };

    var buscarIdProduto = function (idProduto) {
        $.getJSON(URL + "/produto/" + idProduto)
                .success(renderizarLista)
                .then(ativarCollapsible)
                .then(vincularEventos)
                ;
    };

    var obterTermoPesquisado = function (e) {
        var termo = $("#txt-pesquisa").val();
        if (termo === "") {
            buscarTodosProdutos();
        }
        else if (isNaN(termo)) {
            buscarNomeProduto(termo);
        } else {
            buscarIdProduto(termo);
        }

    };

    var limparMarcadores = function () {
        var tamanho = arrayEstabelecimentoMarker.length;
        for (var i = 0; i < tamanho; i++) {
            if (arrayEstabelecimentoMarker[i] != null) {
                arrayEstabelecimentoMarker[i].setMap(null);
                arrayEstabelecimentoMarker[i] = null;
            }

        }
    };

    var anexarMensagemUsuario = function (marker, conteudo) {

        var infoWindowUsuario = new google.maps.InfoWindow({maxWidth: 400, content: conteudo});
        var infoWindowEventUsuario = google.maps.event.addListener(marker, 'click', function () {
            infoWindowUsuario.open(marker.get('map'), marker);
        });

    };

    var inserirMarcadorUsuario = function (posicao, titulo, informacao) {
        var mapAux = map;
        var icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        var marker = new google.maps.Marker({
            title: titulo,
            map: mapAux,
            position: posicao,
            icon: icon
        });

        anexarMensagemUsuario(marker, informacao);
    };

    var inserirMarcador = function (posicao, titulo, informacao) {
        var mapAux = map;
        var marker = new google.maps.Marker({
            title: titulo,
            map: mapAux,
            position: posicao
        });
        arrayEstabelecimentoMarker.push(marker);
        anexarMensagem(marker, informacao);

    };

    var anexarMensagem = function (marker, conteudo) {

        var infoWindow = new google.maps.InfoWindow({maxWidth: 400, content: conteudo});
        var infoWindowEvent = google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(marker.get('map'), marker);
        });


    };

    var recarregarMapa = function (id, latLng) {
        $('#map').appendTo('#mapContainer-' + id);
        var mapParentWidth = $('#mapContainer-' + id).closest(".collapsible-body").width();
        $('#map').width(mapParentWidth);
        $('#map').height(mapParentWidth);
        
        google.maps.event.trigger(map, "resize");
        map.setCenter(latLng);
    };

    var mostrarEstabelecimentos = function (e) {

        var divPai = $(e.currentTarget).parents("div.collapsible-body");
        var id = divPai.find("input[name='id']").val();

        navigator.geolocation.getCurrentPosition(function (localizacao) {
            limparMarcadores();
            var estabelecimentos = obterInformacoesEstabelecimentos(e);
            var tamanho = estabelecimentos.length;
            if (tamanho > 0) {
                for (var i = 0; i < tamanho; i++) {
                    var estabelecimento = estabelecimentos[i];
                    var latLng = new google.maps.LatLng(estabelecimento.latitude, estabelecimento.longitude);
                    var tituloMarcador = estabelecimento.nome + ": " + estabelecimento.unidade;
                    var informacaoBalao = "<div><p>" + tituloMarcador + "</p></div>";
                    inserirMarcador(latLng, tituloMarcador, informacaoBalao);
                }
                var latLngUsuario = new google.maps.LatLng(localizacao.coords.latitude, localizacao.coords.longitude);
                inserirMarcadorUsuario(latLngUsuario, "Minha Posição", "<div><p>Minha Posição</p></div>");
                recarregarMapa(id, latLngUsuario);
            } else {
                alert("Nenhum estabelecimento localizado");
            }
        });

    };

    var obterInformacoesEstabelecimentos = function (e) {
        var arrayEstabelecimentos = [];
        var divPai = $(e.currentTarget).parents("div.collapsible-body");
        var id = divPai.find("input[name='id']").val();
        var tamanho = jsonResult.length;
        for (var i = 0; i < tamanho; i++) {
            var produto = jsonResult[i];
            if (id == produto.idProduto) {
                arrayEstabelecimentos = produto.estabelecimentos;
                break;
            }
        }
        return arrayEstabelecimentos;
    };

    var vincularEventos = function () {
        btnPesquisar.on("click", obterTermoPesquisado);
        var btnMapa = $(".btn-mapa");
        btnMapa.on("click", mostrarEstabelecimentos);
        $(window).on('orientationchange', function (e) {
            var mapParentWidth = $("#map").parent("div").width();
            $('#map').width(mapParentWidth * 0.999);
            $('#map').height(mapParentWidth * 0.999);
            google.maps.event.trigger(map, "resize");
        });
    };

    var buscarTodosProdutos = function () {

        $.getJSON(URL + "/produto/all")
                .success(renderizarLista)
                .then(ativarCollapsible)
                .then(vincularEventos)
                ;
    };

    var initialize = function () {

        directionsService = new google.maps.DirectionsService();
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: centroMapa
        });
        var rendererOptions = {
            map: map,
            suppressMarkers: true
        };

        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    };

    var inicializarPagina = function () {
        vincularEventos();
        initialize();
        //buscarTodosProdutos();
    };

    inicializarPagina();

});