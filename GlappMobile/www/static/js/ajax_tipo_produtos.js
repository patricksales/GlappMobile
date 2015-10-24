/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    var tabelaObj = $("#tabela-tipo-produtos");

    $.getJSON(URL + "/tipoproduto/all")
            .success(function (dadosRecebidos) {
                console.log(dadosRecebidos);
                dadosRecebidos.forEach(function (tipoProduto) {
                    var linha = $("<tr>");
                    var colunaId = $("<td>");
                    var colunaDescricao = $("<td>");
                    colunaId.html(tipoProduto.idTipoProduto);
                    colunaDescricao.html(tipoProduto.descricao);
                    linha.append(colunaId);
                    linha.append(colunaDescricao);
                    tabelaObj.find("tbody").append(linha);
                });
            });

});