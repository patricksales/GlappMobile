/* global cordova */

$(document).ready(function () {
    var btnCamera = $('#ativarCamera');

    var sucessoScan = function (result) {
        alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
    };

    var ligarCamera = function (e) {
        alert("Entrei evento");
        cordova.plugins.barcodeScanner.scan(sucessoScan);
    };

    var vincularEventos = function () {
        btnCamera.on("click", ligarCamera);
    };

    var inicializarPagina = function () {
        vincularEventos();
    };

    inicializarPagina();

});