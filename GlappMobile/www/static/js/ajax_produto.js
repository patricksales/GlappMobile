$(document).ready(function () {

    var listaObj = $("#lista-produto");
    var btnPesquisar = $("#btn-pesquisar");

    var ativarCollapsible = function () {
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };

    var renderizarLista = function (dadosRecebidos) {
        listaObj.html('');
        dadosRecebidos.forEach(function (produto) {

            var li = $('<li></li>');
            var div1 = $('<div class="collapsible-header"><i class="material-icons">assignment_ind</i>' + produto.nome + ' -> ' + produto.marca + '</div>');
            var div2 = $('<div class="collapsible-body"></div>');
            console.log(div2);
            var conteudo = "";
            conteudo += "<p>Ingredientes: " + produto.ingredientes + "<br>" + "Contem gluten: " + produto.contemGluten + "</p>";
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
                ;
    };

    var buscarIdProduto = function (idProduto) {
        $.getJSON(URL + "/produto/" + idProduto)
                .success(renderizarLista)
                .then(ativarCollapsible)
                ;
    };

    var obterTermoPesquisado = function (e) {
        var termo = $("#txt-pesquisa").val();
        if (isNaN(termo)) {
            buscarNomeProduto(termo);
        } else {
            buscarIdProduto(termo);
        }

    };

    var vincularEventos = function () {
        btnPesquisar.on("click", obterTermoPesquisado);
    };

    var buscarTodosProdutos = function () {

        $.getJSON(URL + "/produto/all")
                .success(renderizarLista)
                .then(ativarCollapsible)
                ;
    };

    var inicializarPagina = function () {
        vincularEventos();
        //buscarTodosProdutos();
    };

    inicializarPagina();

});