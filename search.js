// Guia de API: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Exemplo: https://learn-code.wix.com/en/article/1-hello-world
import {session, local} from 'wix-storage';
import wixData from 'wix-data';
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

let myArr = [];
let allData;
$w.onReady(async function () {
	// Get all data
	let datah = await getData().then( res => {
		$w("#repeater9").data = res 
	})

	// Carrinho
	await atualizaCarrinho();
	
	let dataCache = [];

	$w("#repeater9").onItemReady( ($item, data, index) => {
		// Define fields
		const title = $item("#title");
		const modelo = $item("#modelo");
		const addCart = $item("#addCart");
		const image = $item("#image");
		const aplic = $item("#aplic");

		var aplicText = `Aplicação:
						${data.familia ? 'Família: ' + data.familia + ', ' : ''} 
						${data.cilindrada ? 'Cilindrada: ' + data.cilindrada + ', ' : ''} 
						${data.valvulas ? 'Valvula: ' + data.valvulas  + ', ' : ''} 
						${data.bloco ? 'Bloco: ' + data.bloco + ', ' : ''} 
						${data.cilindro ? 'Cilindro: ' + data.cilindro + ', ' : ''} 
						${data.combustivel ? 'Combustível: ' + data.combustivel + ', ' : ''} 
						${data.ano ? 'Ano: ' + data.ano  + ', ' : ''}
						${data.marca ? 'Marca: ' + data.marca : ''}`
   

		// Set fields
		title.text = data.codigo;
		modelo.text = data.carroModelo;
		image.src = data.imagem ? data.imagem : 'https://static.wixstatic.com/media/a10096_b21eacf635a74ff383968ac95a653e0a~mv2.png';
		aplic.text = aplicText;


		// functions
		addCart.onClick( (event, $w) => {

			// Create if not exist cache
			if(!session.getItem("carrinho")){
				session.setItem("carrinho", JSON.stringify([]));
			}

			// Parse data do an object
			let currentCart =  session.getItem('carrinho');
			currentCart = JSON.parse(currentCart)
			
			// Check if exist
			const doesExist = (obj, value) => {
				for( let j = 0 ; j < obj.length ; j++){
					if( obj[j].id_item === value ){
						return true
					}
				}
				return false
			}
			let existData = doesExist(currentCart, data._id);

			// If not add to cart
			if(!existData){
				currentCart.push({"id_item":data._id, "qtd":"1"})
				let insert = JSON.stringify(currentCart);
				session.setItem("carrinho", insert);
				atualizaCarrinho();
			}
		});

	});
});

export function atualizaCarrinho(){
	let countCart =  session.getItem('carrinho');

	if(countCart){
		countCart = JSON.parse(countCart).length
		$w("#checkout").label = `Carrinho ${countCart}`;
	}else{
		$w("#checkout").label = 'Carrinho 0';
	}	
}

async function getData(){
	let query = wixLocation.query
	
	let filter = wixData.filter().eq('status', 1)
		.and(wixData.filter().eq(query.bloco ? 'bloco' : 'status', query.bloco ? transformText(query.bloco) : 1))
		.and(wixData.filter().eq(query.carroModelo ? 'carroModelo' : 'status', query.carroModelo ? transformText(query.carroModelo) : 1))
		.and(wixData.filter().eq(query.categoria ? 'categoria' : 'status', query.categoria ? transformText(query.categoria) : 1))
		.and(wixData.filter().eq(query.ano ? 'ano' : 'status', query.ano ? transformText(query.ano) : 1))
		.and(wixData.filter().eq(query.valvulas ? 'valvulas' : 'status', query.valvulas ? transformText(query.valvulas) : 1))
		.and(wixData.filter().eq(query.cilindrada ? 'cilindrada' : 'status', query.cilindrada ? transformText(query.cilindrada) : 1))
		.and(wixData.filter().eq(query.familia ? 'familia' : 'status', query.familia ? transformText(query.familia) : 1))
		.and(wixData.filter().eq(query.marca ? 'marca' : 'status', query.marca ? transformText(query.marca) : 1))

	let item = await wixData.aggregate("catalogo1")
		.filter(filter)
		.limit(1000)
		.run()
		.then( async x => {
			let u = x.items;

			if(x.hasNext()){
				while (x.hasNext()) {
					x = await x.next();
					u = u.concat(x.items);
				}
			}

			return [x.items, u]
			
		})

	console.log(item)
	$w("#text1").text = `${item[1].length} Itens Encontrados`
	return item[0];
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function checkout_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	wixWindow.openLightbox("carrinho")
}

function transformText(text){
	return text.replace('+', ' ')
}
