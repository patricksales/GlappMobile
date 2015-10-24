/* 
 * Esse arquivo é que vai fazer toda a mágica
 * Leia a documentação das funções
 */

/* 
 * O bloco de código dentro só será executado quando a página estiver pronta,
 * ou seja, quando o HTML for todo interpretado
 */
$(document).ready(function () {
    
    /*
    * Método simplesmente coloca dentro da div conteudo
    * o HTML que for passado como parametro    
    */
    var preencherPagina = function(conteudoHTML){
        $("#conteudo").html(conteudoHTML);
        ativarCollapsible();
    };
    
    
    /*
     * Responsável por lidar com os eventos de click nos <a href=""></a>
     */
    var linkClick = function(evento){
        
        //Impede que o comportamento defaul aconteça, isso é,
        //o navegador ir para a página
        evento.preventDefault();
        
        //Pega a url que estiver no href do link
        var url = $(this).attr("href");
        
        if(url.indexOf(".html") >= 0){
            //Faz uma requisição ajax para o link e pega todo o HTML que estiver
            //dentro do arquivo
            $.ajax({
                url: url,
                method: "GET",
                contentType: "html"
            })
            //Ao completar o ajax, chama a função preencherPagina
                .done(preencherPagina);
        }
        
    };
    
    /*
     * Para todo link clicado, a função link click será chamada
     */
    var vincularEventos = function(){
        $("a").on("click", linkClick);
    };
    
    
    /*
     * Para a index não ficar vazia, o conteudo da página conteudo1.html
     * é carregado
     */
    var paginaInicial = function(){
        $.ajax({
            url: "pagina1.html",
            method: "GET",
            contentType: "html"
        })
                .done(preencherPagina);
    };
    
    /*
     * Funções que devem ser executadas para inicializar a página
     * isso é, carregar o conteudo da página inicial e
     * vincular os links para que ocorra a troca de conteudo
     */
    var inicializarPagina = function(){
        //paginaInicial();
        vincularEventos();
    };
    
    var ativarCollapsible = function(){
        $('.collapsible').collapsible({
            accordion: true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };
    
    //Só chama essa função para inicializar o que precisa na página.
    inicializarPagina();
    
});


