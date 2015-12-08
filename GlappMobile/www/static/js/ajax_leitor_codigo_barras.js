/* global cordova, URL */


var btnCamera = $('#ativarCamera');
var divInformacoes = $('#informacoes_produto');

var exibirInformacaoProduto = function (dados) {
    if (dados.length === 1) {
        var objProduto = dados[0];
        var conteudo = "";
        //conteudo += '<p>ID: ' + objProduto.idProduto + '</p>';
        conteudo += '<p>Nome: ' + objProduto.nome + '</p>';
        conteudo += '<p>Marca: ' + objProduto.marca + '</p>';        
        conteudo += '<p>Contem gluten: ' + (objProduto.contemGluten ? "Sim" : "Não") + '</p>';
        conteudo += '<p>Contem lactose: ' + (objProduto.contemLactose ? "Sim" : "Não") + '</p>';
        conteudo += '<p>Peso: ' + objProduto.pesoQuant + 'g</p>';
        conteudo += '<p>CodigoEAN: ' + objProduto.codigoEAN + '</p>';
        divInformacoes.html(conteudo);
    } else {
        divInformacoes.html("Erro!");
    }
};

var buscarCodigoBarrasProduto = function (codigoBarras) {
    $.getJSON(URL + "/produto/procura/", {
        "campo": "codigoEAN",
        "valor": codigoBarras
    })
            .success(exibirInformacaoProduto);

};

var sucessoScan = function (result) {
    var codigoBarras = result.text;
    var cancelado = result.cancelled;
    if (!cancelado) {

        buscarCodigoBarrasProduto(codigoBarras);
    }

};

var ligarCamera = function (e) {

    cordova.plugins.barcodeScanner.scan(sucessoScan);
};

var vincularEventos = function () {
    btnCamera.on("click", ligarCamera);
};

var inicializarPagina = function () {
    vincularEventos();
};

inicializarPagina();