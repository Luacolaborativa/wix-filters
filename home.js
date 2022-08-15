 // Guia de API: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Exemplo: https://learn-code.wix.com/en/article/1-hello-world
import wixData from 'wix-data';
import wixLocation from 'wix-location';

var urlFamilia = '';
var urlMarca = '';
var urlCategoria = '';
var urlCarroModelo = '';
var urlAno = '';
var urlCilindrada = '';
var urlValvulas = '';
var urlBloco = '';
var url = [];
var urlFeita = [];
var urlDinamica = '';

$w.onReady(async function () {
	await buscaFiltro()
});

async function buscaFiltro(){
	
	await getData('#familia','familia','Todas');
	await getData('#marca','marca', 'Todas');
	await getData('#anoId','ano', 'Todos');
	await getData('#categoria','categoria', 'Todas');
	await getData('#carroModelo','carroModelo', 'Todos');
	await getData('#cilindrada','cilindrada', 'Todas');
	await getData('#valvula','valvulas', 'Todas');
	await getData('#bloco','bloco', 'Todos');
}

function prepareDataForDropdown(data, column, plhold = 'Selecione') {
	return [{label: plhold, value: ''}, data.map(item => {
		return {
			label: item[column],
			value: item[column]
		}
	})]
}

async function getData(id, group, plhold){
	
	let filter = wixData.filter().eq('status', 1)
		.and(wixData.filter().eq(urlCategoria != '' ? 'categoria' : 'status', urlCategoria != '' ? urlCategoria : 1))
		.and(wixData.filter().eq(urlCarroModelo != '' ? 'carroModelo' : 'status', urlCarroModelo != '' ? urlCarroModelo : 1))
		.and(wixData.filter().eq(urlAno != '' ? 'ano' : 'status', urlAno != '' ? urlAno : 1))
		.and(wixData.filter().eq(urlValvulas != '' ? 'valvulas' : 'status', urlValvulas != '' ? urlValvulas : 1))
		.and(wixData.filter().eq(urlCilindrada != '' ? 'cilindrada' : 'status', urlCilindrada != '' ? urlCilindrada : 1))
		.and(wixData.filter().eq(urlFamilia != ''? 'familia' : 'status', urlFamilia != '' ? urlFamilia : 1))
		.and(wixData.filter().eq(urlMarca != '' ? 'marca' : 'status', urlMarca != '' ? urlMarca : 1))
		.and(wixData.filter().eq(urlBloco != '' ? 'bloco' : 'status', urlBloco != '' ? urlBloco : 1))

	await wixData.aggregate('catalogo1')
	.filter(filter)
	.group(group)
	.run()
	.then( res => {
		$w(id).options = [];
		var myArr = res.items
		var itx = prepareDataForDropdown(myArr, group, plhold)
		var allArr = [{label:itx[0].label, value:"0"}, ...itx[1]]
		
		$w(id).options = allArr;
	})
}

export function familia_change(event) {
	var familia1 = $w('#familia').value;

	if( familia1 == '0' ){
		urlFamilia = ''
	}else{
		urlFamilia = familia1
	}
	
	buscaFiltro();
}

export async function marca_change(event) {
	var marca1 = $w('#marca').value;

	if( marca1 == '0' ){
		urlMarca = ''
	}else{
		urlMarca = marca1
	}
	
	buscaFiltro();
}

export function categoria_change(event) {
	var categoria1 = $w('#categoria').value;

	if( categoria1 == '0' ){
		urlCategoria = ''
	}else{
		urlCategoria = categoria1
	}
	
	buscaFiltro();
}

export function carroModelo_change(event) {
	var carroModelo1 = $w('#carroModelo').value;

	if( carroModelo1 == '0' ){
		urlCarroModelo = ''
	}else{
		urlCarroModelo = carroModelo1
	}
	
	buscaFiltro();
}

export function ano_change(event) {
	var ano1 = $w('#anoId').value;

	if( ano1 == '0' ){
		urlAno = ''
	}else{
		urlAno = ano1
	}
	
	buscaFiltro();
}

export function cilindrada_change(event) {
	var cilindrada1 = $w('#cilindrada').value;

	if( cilindrada1 == '0' ){
		urlCilindrada = ''
	}else{
		urlCilindrada = cilindrada1
	}
	
	buscaFiltro();
}

export function valvulas_change(event) {
	var valvulas1 = $w('#valvula').value;

	if( valvulas1 == '0' ){
		urlValvulas = ''
	}else{
		urlValvulas = valvulas1
	}
	
	buscaFiltro();
}

export function bloco_change(event) {
	var bloco1 = $w('#bloco').value;

	if( bloco1 == '0' ){
		urlBloco = ''
	}else{
		urlBloco = bloco1
	}
	
	buscaFiltro();
}

export function cleanFilter(event){
	$w('#familia').selectedIndex = 0;
	$w('#cilindrada').selectedIndex = 0;
	$w('#valvula').selectedIndex = 0;
	$w('#anoId').selectedIndex = 0;
	$w('#carroModelo').selectedIndex = 0;
	$w('#categoria').selectedIndex = 0;
	$w('#marca').selectedIndex = 0;
	$w('#bloco').selectedIndex = 0;
}

export function go_to(event) {
    // console.log(event);
    // return redirect("produto-page");
	urlFeita = [];
	urlDinamica = '';

	url = [ 
			{nome: 'familia', valor: urlFamilia},
			{nome: 'marca', valor: urlMarca},
			{nome: 'categoria', valor: urlCategoria},
			{nome: 'carroModelo', valor: urlCarroModelo},
			{nome: 'ano', valor:urlAno},
			{nome: 'cilindrada', valor:urlCilindrada},
			{nome: 'valvulas', valor:urlValvulas}
		];
	
    for(let i = 0; i<url.length; i++){
		if(url[i].valor != ''){
    	 	urlFeita.push(url[i]);
		}
    }

	for(let y = 0; y<urlFeita.length; y++){
		urlDinamica += `${urlFeita[y].nome}=${urlFeita[y].valor}&`;
	}

	console.log(urlDinamica)
    wixLocation.to(`/pesquisa?${urlDinamica}`);
}
