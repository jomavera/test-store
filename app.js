var  cartNum = 0;

function getCard(data){

    let url_image = data.url_image;
    if (url_image === ''){
        url_image = "https://via.placeholder.com/400x400"
    }
    let html_ = `<div class='col m-3'>
        <div class="card" style="heigth:auto; width:350px" >
            <img
                    src="${url_image}"
                    class="card-img-top"
                    alt="photo"
                    style="height:350px; width:auto"
                />
            <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <p class="card-text">Price: $${data.price}</p>
                <p class="card-text text-success">Discount: ${data.discount}</p>
                <div class="row">
                    <div class="col-1 offset-8">
                        <button type="button" class="btn btn-outline-warning anadirCarro"><i class="fa fa-shopping-cart"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html_
}

async function fetchCountCat(category_id){
    const response = await fetch(`http://localhost:5000/count?category_id=${category_id}`,{
        method: 'GET'
      }
    )
    let data = await response.json();
    return data[0].cuenta;
}

async function searchPageCategory(page, category_id){

    async function fetchPageCat(category_id){
		const response = await fetch(`http://localhost:5000/read?category_id=${category_id}&page=${page}`,{
            method: 'GET'
          }
        )
		let data = await response.json();
        let html_array = data.map((e) => getCard(e))
		return html_array;
	}

    const html_array = await fetchPageCat(category_id);
    let htmls = "";

    for (let index=0;index<html_array.length;index++){
        htmls += html_array[index]
    }

    cards.innerHTML = htmls;
}

window.onload = async function() {

    let contador = await fetchCountCat(1);

    async function fetchPage(){
		const response = await fetch("http://localhost:5000/read?category_id=1&page=1",{
            method: 'GET'
          }
        )
		let data = await response.json();
        let html_array = data.map((e) => getCard(e))
		return html_array;
	}

    const html_array = await fetchPage()
    let htmls = "";

    for (let index=0;index<html_array.length;index++){
        htmls += html_array[index]
    }

    titulo.innerHTML = 'bebida energetica';
    cards.innerHTML = htmls;

    let botonesPaginacion = '';
    let numPags = Math.ceil(contador/10)
    for (let index = 1; index<numPags+1;index++){
        botonesPaginacion += `<li class="page-item"><a class="page-link" id="pagina-${index}">${index}</a></li>`;
    }
    paginacion.innerHTML = botonesPaginacion;
    for (let index = 1; index<numPags+1;index++){
        var element = document.getElementById(`pagina-${index}`);
        element.onclick = function(){
            searchPageCategory(index, 1)
        }
    }
    const addToCart = document.getElementsByClassName('anadirCarro');

    for (let i = 0; i < addToCart.length; i++) {
        boton = addToCart[i];
        boton.addEventListener('click', addToCartClicked)
    }
  };

async function searchCategory(category, category_id){

    let contador = await fetchCountCat(category_id);

    async function fetchPageCat(category_id){
		const response = await fetch(`http://localhost:5000/read?category_id=${category_id}&page=1`,{
            method: 'GET'
          }
        )
		let data = await response.json();
        let html_array = data.map((e) => getCard(e))
		return html_array;
	}

    const html_array = await fetchPageCat(category_id);
    let htmls = "";

    for (let index=0;index<html_array.length;index++){
        htmls += html_array[index]
    }

    titulo.innerHTML = category;
    cards.innerHTML = htmls;

    let botonesPaginacion = '';
    let numPags = Math.ceil(contador/10)
    for (let index = 1; index<numPags+1;index++){
        botonesPaginacion += `<li class="page-item"><a class="page-link" id="pagina-${index}">${index}</a></li>`;
    }
    paginacion.innerHTML = botonesPaginacion;
    for (let index = 1; index<numPags+1;index++){
        var element = document.getElementById(`pagina-${index}`);
        element.onclick = function(){
            searchPageCategory(index, category_id)
        }
    }
    const addToCart = document.getElementsByClassName('anadirCarro');

    for (let i = 0; i < addToCart.length; i++) {
        boton = addToCart[i];
        boton.addEventListener('click', addToCartClicked)
    }
}

async function searchProducts(name, discount){

    async function fetchPageProd(name, discount){
		const response = await fetch(`http://localhost:5000/filter?name=${name}&discount=${discount}&page=1`,{
            method: 'GET'
          }
        )
		let data = await response.json();
        let html_array = data.map((e) => getCard(e))
		return html_array;
	}

    const html_array = await fetchPageProd(name, discount);
    let htmls = "";

    for (let index=0;index<html_array.length;index++){
        htmls += html_array[index]
    }

    titulo.innerHTML = 'Resultados busqueda';
    cards.innerHTML = htmls;
    paginacion.innerHTML = '';
    
    const addToCart = document.getElementsByClassName('anadirCarro');

    for (let i = 0; i < addToCart.length; i++) {
        boton = addToCart[i];
        boton.addEventListener('click', addToCartClicked)
    }
}


const categories = {
    'bebida energetica': 1,
    'pisco':2,
    'ron': 3,
    'bebida':4,
    'snack':5,
    'cerveza':6,
    'vodka':7
}

Object.entries(categories).forEach((e) => {
    var element = document.getElementById(e[0]);
    element.onclick = function(){
        searchCategory(e[0], e[1])
    }
});

var formulario = document.getElementById("busqueda");

formulario.onsubmit = (e)=>{
    e.preventDefault()

    let name = formulario.elements["busquedaPorNombre"].value
    let discount = formulario.elements["busquedaPorDescuento"].value

    if (discount === '' || isNaN(discount)) {
        discount = 0;
    }

    searchProducts(name, discount);
};

  
function addToCartClicked(e) {
    button = e.target;
    var cartItem = button.parentElement.parentElement.parentElement.parentElement;
    var nombre = cartItem.getElementsByClassName('card-title')[0].innerText;
    var precio = cartItem.getElementsByClassName('card-text')[0].innerText;
    addItemToCart (nombre, precio);
}

function addItemToCart(nombre, precio) {
    var divFila = document.createElement('div');
    var filaProducto = document.createElement('li');
    var productosCart = document.getElementsByClassName('dropdown-menu')[2];
    var textoCarro = document.getElementsByClassName('carro-texto');
    
    for (var i = 0; i < textoCarro .length; i++){
      if (textoCarro[i].innerText == nombre){
        alert ('El producto ya esta en el carro')
        return;
      }
    }

    cartNum += 1
    var badgeCart = document.getElementsByClassName('cart-quantity')[0];
    badgeCart.innerHTML = cartNum;

    var filaProductoHTML = `
        <div class="dropdown-item carro-texto" >${nombre}</div>
        <button type="button" class="btn btn btn-light remove-btn"><i class="fa fa-trash"></i></button>
    `
    filaProducto.innerHTML = filaProductoHTML;
    divFila.append(filaProducto);
    productosCart.append(divFila);
    divFila.getElementsByClassName('remove-btn')[0].addEventListener('click', removeItem)

}

const removeBtn = document.getElementsByClassName('remove-btn');
for (var i = 0; i < removeBtn.length; i++) {
  button = removeBtn[i]
  button.addEventListener('click', removeItem)
}

function removeItem(e) {
    btnClicked = e.target;
    btnClicked.parentElement.parentElement.remove();
    cartNum -= 1;
    var badgeCart = document.getElementsByClassName('cart-quantity')[0];
    badgeCart.innerHTML = cartNum;
}