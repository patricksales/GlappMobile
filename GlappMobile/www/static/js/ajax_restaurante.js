$(document).ready(function () {

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
            console.log(div2);
            var conteudo = "";
            conteudo += "<p>Site: " + restaurante.site + "</p>";
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
                ;
    };

    var buscarIdRestaurante = function (idRestaurante) {
        $.getJSON(URL + "/restaurante/" + idRestaurante)
                .success(renderizarLista)
                .then(ativarCollapsible)
                ;
    };

    var buscarTodosRestaurantes = function () {

        $.getJSON(URL + "/restaurante/all")
                .success(renderizarLista)
                .then(ativarCollapsible)
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
        btnPesquisar.on("click", obterTermoPesquisado);
    };

    var inicializarPagina = function () {
        vincularEventos();
        //buscarTodosProdutos();
    };

    inicializarPagina();
});