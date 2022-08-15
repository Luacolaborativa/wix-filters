// Guia de API: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Exemplo: https://learn-code.wix.com/en/article/1-hello-world
import {session} from 'wix-storage';
import wixData from 'wix-data';
import { triggeredEmails } from 'wix-crm';
import wixLocation from 'wix-location';

$w.onReady( function () {	
	// To select an element by ID use: $w('#elementID')
	// user to receive the email
	let emailText = '';
	// const user = "80a3ee4f-8c13-4c71-8115-5398165e8b8f";
	const user = "6be76d65-6912-430e-9f08-66b0a0286639";

	// Get data
	let fe = getItem().then(  (x) => {
		
		// Create email body
		x.map( y => {
			let qrtdCart = loadCart(y._id);
			emailText += `Marca: ${y.marca}, Bloco: ${y.bloco}, Válvulas: ${y.valvulas}, Quantidade (${qrtdCart}) \n` 
		});
		
		$w("#items").data = x
		return emailText
	} );

	
	$w("#items").onItemReady( ($item, data, index) => {
		const imagem = $item("#image1");
		const title = $item("#text1");
		const less = $item("#btnless");
		const add = $item("#btnadd");
		const qtdCart = $item("#qtdCart");

		imagem.src = data.imagem ?? 'https://static.wixstatic.com/media/a10096_b21eacf635a74ff383968ac95a653e0a~mv2.png';
		qtdCart.text = String(loadCart(data._id));
		title.text = `Código:  ${data.codigo ? 'Código: '+data.codigo : '' } ${data.bloco ? 'Bloco: '+data.bloco : '' } ${data.carroModelo ? 'Modelo: '+data.carroModelo: ''  }`;

		less.onClick( () =>{
			decrease(data._id, index)
			qtdCart.text = String(loadCart(data._id));
			getItem().then(  (x) => {
		
				// Create email body
				x.map( y => {
					let qrtdCart = loadCart(y._id);
					emailText += `Marca: ${y.marca}, Bloco: ${y.bloco}, Válvulas: ${y.vlvulas}, Quantidade (${qrtdCart}) \n` 
				});
				
				$w("#items").data = x
				return emailText
			} );
		})

		add.onClick( () =>{
			increase(data._id)
			qtdCart.text = String(loadCart(data._id));
		})
	});

	//Send email
	$w("#mail").onClick( async () =>{
		let sendEmail = await getItem().then( x => {
			x.map( y => {
				let qrtdCart = loadCart(y._id);
				emailText += `Marca: ${y.marca}, Bloco: ${y.bloco}, Válvulas: ${y.vlvulas}, Quantidade (${qrtdCart}) \n` 
			});
			$w("#items").data = x
			return emailText
		} );

		console.log(sendEmail);
		
		await triggeredEmails.emailMember('TDC404x', user, {
			variables: {
				desc: sendEmail
			}
		})
		.then( x => {
			$w("#items").data = [];
			$w('#text2').text = "Enviado com sucesso";
			$w('#mail').hide();
		})
		.catch( err => console.log(err));

	})

	// Clean card
	$w("#cleanCard").onClick( () => {
		$w("#items").data = [];
		session.setItem("carrinho", JSON.stringify([]));

		wixLocation.to(wixLocation.url);
	})

//...
	
	// Click 'Preview' to run your code
});

async function getItem(){

	let full = [];
	const data = JSON.parse(session.getItem("carrinho"));
	for ( let j = 0 ; j < data.length ; j++){
		if(typeof data[j].id_item === 'string'){
			full.push(await wixData.get("catalogo1", data[j].id_item)
			.then( result => {
				return result
			})
			.catch( err => console.log(err)))
		}
		
	}
	
	return full;
}

function decrease(id, index){
	let minus = JSON.parse(session.getItem("carrinho"));
	if(typeof id === 'string' && id !== null){
		for(let k = 0; k < minus.length ; k++){
			if(minus[k].id_item === id){
				if(parseInt(minus[k].qtd) > 0){
					minus[k].qtd = parseInt(minus[k].qtd)-1;
				}
				console.log(minus)
				if(parseInt(minus[k].qtd) == 0){
					minus[k] = [];
				}
				
			}
		}
	}
	
	session.setItem("carrinho", JSON.stringify(minus))
}

function increase(id){
	const plus = JSON.parse(session.getItem("carrinho"));
	if(typeof id === 'string' && id !== null){
		for(let k = 0; k < plus.length ; k++){
			if(plus[k].id_item === id){
				plus[k].qtd = parseInt(plus[k].qtd)+1;
			}
		}
	}
	
	session.setItem("carrinho", JSON.stringify(plus))
}

function loadCart(id){
	const load = JSON.parse(session.getItem("carrinho"));
	if(typeof id === 'string' && id !== null){
		for(let k = 0; k < load.length ; k++){
			if(load[k].id_item === id){
				return load[k].qtd
			}
		}
	}

	return '00';
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function button1_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	wixLocation.to(wixLocation.url);
}
