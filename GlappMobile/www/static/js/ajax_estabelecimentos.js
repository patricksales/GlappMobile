$(document).ready(function () {

    var ativarCollapsible = function () {
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };

    var listaObj = $("#lista-estabelecimento");

    $.getJSON(URL + "/estabelecimento/all")
            .success(function (dadosRecebidos) {
                dadosRecebidos.forEach(function (estabelecimento) {
                    var li = $('<li></li>');
                    var div1 = $('<div class="collapsible-header"><i class="material-icons">business</i>' + estabelecimento.nome + ' -> ' + estabelecimento.unidade + '</div>');
                    var div2 = $('<div class="collapsible-body"></div>');
                    console.log(div2);
                    var conteudo = "";
                    conteudo += "<p>Site: " + estabelecimento.site + "</p>";
                    div2.html(conteudo);
                    li.append(div1);
                    li.append(div2);
                    listaObj.append(li);
                });
                ativarCollapsible();
            });

});