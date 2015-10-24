$(document).ready(function () {

    var ativarCollapsible = function () {
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };

    var listaObj = $("#lista-restaurante");

    $.getJSON(URL + "/restaurante/all")
            .success(function (dadosRecebidos) {
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
                ativarCollapsible();
            });

});