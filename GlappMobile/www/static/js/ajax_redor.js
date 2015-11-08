/* global google, URL */

$(document).ready(function () {
    "use strict";

    var centroMapa = {lat: -23.5505200, lng: -46.6333090};
    var map, geocoder;
    var latLngUsuario;

    var anexarMensagemUsuario = function (marker, conteudo) {

        var infoWindowUsuario = new google.maps.InfoWindow({maxWidth: 400, content: conteudo});
        var infoWindowEventUsuario = google.maps.event.addListener(marker, 'click', function () {
            infoWindowUsuario.open(marker.get('map'), marker);
        });

    };

    var anexarMensagem = function (marker, conteudo) {

        var infoWindow = new google.maps.InfoWindow({maxWidth: 400, content: conteudo});
        var infoWindowEvent = google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(marker.get('map'), marker);
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
        var icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
        var mapAux = map;

        var marker = new google.maps.Marker({
            title: titulo,
            map: mapAux,
            position: posicao,
            icon: icon
        });


        anexarMensagem(marker, informacao);
    };

    var prepararMarcadores = function (dados) {
        var estabelecimentos = dados;

        estabelecimentos.forEach(function (estabelecimento) {

            var latLng = new google.maps.LatLng(estabelecimento.latitude, estabelecimento.longitude);

            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                    {
                        origins: [latLngUsuario],
                        destinations: [latLng],
                        travelMode: google.maps.TravelMode.DRIVING
                    }, function (response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK) {
                    var results = response.rows[0].elements;
                    var element = results[0];
                    var distance = element.distance.text;
                    var duration = element.duration.text;
                    var tituloMarcador = estabelecimento.nome + " " + estabelecimento.unidade;
                    var informacaoBalao = "<div>" +
                            "<p>" + tituloMarcador + "</p>" +
                            "<p>Distância: " + distance + "</p>" +
                            "<p>Tempo estimado: " + duration + "</p>" +
                            "</div>";
                    inserirMarcador(latLng, tituloMarcador, informacaoBalao);
                }
            });

        });

    };

    var buscarLocalidadeProxima = function () {



        navigator.geolocation.getCurrentPosition(function (dados) {

            var latitudeUsuario = dados.coords.latitude;
            var longitudeUsuario = dados.coords.longitude;
            var latLng = new google.maps.LatLng(latitudeUsuario, longitudeUsuario);
            latLngUsuario = latLng;

            inserirMarcadorUsuario(latLng, "Minha Posição", "<div><p>Minha Posição</p></div>");


            map.setCenter(latLng);

            $.getJSON(URL + "/estabelecimento/distancia/", {
                "campo": "latitude",
                "valor": latitudeUsuario,
                "campo2": "longitude",
                "valor2": longitudeUsuario
            })
                    .success(prepararMarcadores)
                    ;

        }, null, {timeout: 10000, enableHighAccuracy: true});

    };

    var ajustaTamanhoMapa = function () {
        var largura = $("#mapContainer").width();
        var altura = largura;

        $("#map").width(largura);
        $("#map").height(altura);

    };

    var initialize = function () {

        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: centroMapa
        });

    };

    var vincularEventos = function () {

        $(window).on('orientationchange', function (e) {
            setTimeout(function () {
                var mapParentWidth = $("#map").parent("div").width();
                $('#map').width(mapParentWidth * 0.999);
                $('#map').height(mapParentWidth * 0.999);
                google.maps.event.trigger(map, "resize");
            }, 500);

        });

    };

    var inicializarPagina = function () {
        ajustaTamanhoMapa();
        initialize();
        buscarLocalidadeProxima();
        vincularEventos();
    };

    inicializarPagina();

});
