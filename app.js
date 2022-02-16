var  cartNum = 0; //Numero de productos en el carro (variable global)

// INICIO --- Generar carta de producto
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
};
// FIN --- Generar carta de producto

// INICIO --- Extraer numero de productos por categoria (para paginacion)
async function fetchCountCat(category_id){
    const response = await fetch(`http://localhost:5000/count?category_id=${category_id}`,{
        method: 'GET'
      }
    )
    let data = await response.json();
    return data[0].cuenta;
}
// FIN --- Extraer numero de productos por categoria (para paginacion)

// INICIO ---  Extraer info de productos por categoria por pagina (segun paginacion) y generar cartas
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
};
// FIN --- Extraer info de productos por categoria por pagina (segun paginacion)


// INICIO --- Al cargar pagina inicial extraer info de productos de categoria 1, pagina 1 y generar cartas
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
// FIN --- Al cargar pagina inicial extraer info de productos de categoria 1, pagina 1 y generar cartas

// INICIO --- Extraer info de productos por categoria en pagina 1 (segun paginacion) y generar cartas
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
};
// FIN --- Extraer info de productos por categoria en pagina 1 (segun paginacion) y generar cartas


// INICIO --- Extraer info de productos por busqueda y generar cartas
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
};
// FIN --- Extraer info de productos por busqueda y generar cartas


// INICIO --- Anadir funcionalidad a botones de categorias en el navbar
const categories = {
    'bebida energetica': 1,
    'pisco':2,
    'ron': 3,
    'bebida':4,
    'snack':5,
    'cerveza':6,
    'vodka':7
};

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
// FIN --- Anadir funcionalidad a botones de categorias en el navbar


// INICIO --- Funciones relacionadas al shopping car  
function addToCartClicked(e) {
    var button = e.target;
    var cartItem = button.parentElement.parentElement.parentElement.parentElement;
    var nombre = cartItem.getElementsByClassName('card-title')[0].innerText;
    var precio = cartItem.getElementsByClassName('card-text')[0].innerText.match(/(?<=[$])\d*/)[0];
    addItemToCart(nombre, precio);
};

function addItemToCart(nombre, precio) {
    var divFila = document.createElement('div');
    divFila.classList.add('dropdown-item');
    var filaProducto = document.createElement('li');
    let productosCarro = document.getElementsByClassName('dropdown-menu')[2];
    var textoCarro = document.getElementsByClassName('carro-texto');
    
    for (var i = 0; i < textoCarro .length; i++){
      if (textoCarro[i].innerText == nombre){
        alert ('El producto ya esta en el carro')
        return;
      }
    }

    cartNum += 1
    var badgeCarro = document.getElementsByClassName('carro-cantidad')[0];
    badgeCarro.innerHTML = cartNum;

    var filaProductoHTML = `
        <div class="carro-texto" >${nombre}</div>
        <input class="cantidad-producto" type="number" value="1">
        <div class="carro-precio" >$${precio}</div>
        <button type="button" class="btn btn btn-light remove-btn"><i class="fa fa-trash"></i></button>
    `
    filaProducto.innerHTML = filaProductoHTML;
    divFila.append(filaProducto);
    productosCarro.append(divFila);

    var botonBorrar = divFila.getElementsByClassName('remove-btn')[0];
    botonBorrar.addEventListener('click', quitarProducto);
    var input = divFila.getElementsByClassName('cantidad-producto')[0];
    input.addEventListener('change', changeQuantity);
    actualizarPrecioCarro(productosCarro);
};

function quitarProducto(e) {
    var btnClicked = e.target;
    var parentBtnClicked = btnClicked.parentElement.parentElement;
    parentBtnClicked.remove();
    cartNum -= 1;
    var badgeCarro = document.getElementsByClassName('carro-cantidad')[0];
    badgeCarro.innerHTML = cartNum;
    let productosCarro = document.getElementsByClassName('dropdown-menu')[2];
    actualizarPrecioCarro(productosCarro)
}

function changeQuantity(event) {
  var input = event.target
  if (isNaN(input.value) || input.value <= 0){
    input.value = 1
  }
  let productosCarro = document.getElementsByClassName('dropdown-menu')[2];
  actualizarPrecioCarro(productosCarro)
};

function actualizarPrecioCarro(productosCarro) {
    var total = 0
    let productosLista = productosCarro.getElementsByClassName('dropdown-item');

    for (var i = 0; i < productosLista.length; i ++) {
      var filaCarro = productosLista[i]
      if (filaCarro.hasChildNodes()) {
        var precioElemento = filaCarro.getElementsByClassName('carro-precio')[0]
        var cantidadElemento = filaCarro.getElementsByClassName('cantidad-producto')[0].value
        var precio = parseFloat(precioElemento.innerText.replace('$', ''))
        total = total + (precio*cantidadElemento)
      } else {
          filaCarro.remove();
      }
      
    }
    document.getElementsByClassName('total-precio')[0].innerText =  'Total Carro $' + total
};
// FIN --- Funciones relacionadas al shopping car  