$(document).ready(function () {

    var ativarCollapsible = function () {
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };

    var listaObj = $("#lista-produto");

    $.getJSON(URL + "/produto/all")
            .success(function (dadosRecebidos) {
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
                ativarCollapsible();
            });

});