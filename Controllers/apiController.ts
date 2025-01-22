const menu = [
    { id: 1, name: 'Gringa de suadero', price: 50, stock: 20 },
    { id: 2, name: 'Gringa de Asada', price: 50, stock: 20},
    { id: 3, name: 'Tacos de adobada', price: 90, stock: 20 },
    { id: 4, name: 'Tacos de Bistec', price: 90, stock: 20 },
    { id: 5, name: 'Hamburguesa Magno', price: 90, stock: 20 },
    { id: 6, name: 'Hamburguesa Atenea', price: 90, stock: 20 },
    { id: 7, name: 'Hot-Dog Homero', price: 40, stock: 20 },
    { id: 8, name: 'Hot-dog Aristoteles', price: 40, stock: 20 },
    { id: 9, name: 'Boneless Bufalo', price: 100, stock: 20 },
    { id: 10, name: 'Boneless BBQ', price: 100, stock: 20 }
];

const cart = [];

const usuarios = [
    { id: 1, nombre: 'Juan', apellido: 'Perez', email: 'juanperez@gmail.com', contraseña: '123456' },
    { id: 2, nombre: 'Teresa', apellido: 'Estrada', email: 'tere@gmail.com', contraseña: '123456' },
    { id: 3, nombre: 'Pedro', apellido: 'Rodriguez', email: 'pedroperez@gmail.com', contraseña: '123456' }
]

// verifico que existe el producto
function isProductAvailable(productId) {
    return menu.find(item => item.id === productId) || null;
}

// valido si el producto tiene suficiente stock xd
function hasSufficientStock(product, quantity) {
    return quantity <= product.stock;
}

// actualiza la cantidad de lso productos añadidos al carrito
function updateCartItem(cartItem, product, quantity) {
    if (cartItem.quantity + quantity > product.stock) {
        console.log(`No puedes añadir más de ${product.stock} unidades en total.`);
        return false;
    }
    cartItem.quantity += quantity;
    return true;
}

//añade un nuevo prpducto al carrito, esto aplica cuando añade productos diferentes
function addNewItemToCart(product, quantity) {
    cart.push({ id: product.id, name: product.name, price: product.price, quantity });
}

function reduceStock(product, quantity) {
    product.stock -= quantity;
}

// añade el producto al carrito en el caso de que quiera añadir otra
function addToCart(productId, quantity) {
    // Validar si el producto existe
    const product = isProductAvailable(productId);
    if (!product) {
        console.log('Producto no encontrado.');
        return;
    }

    if (!hasSufficientStock(product, quantity)) {
        console.log(`No hay suficiente stock. Solo quedan ${product.stock} unidades disponibles.`);
        return;
    }

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (!updateCartItem(cartItem, product, quantity)) return;
    } else {
        addNewItemToCart(product, quantity);
    }

    reduceStock(product, quantity);

    console.log(`Añadido ${quantity} de "${product.name}" al cart.`);
}

const addresses = [];

function registerAddress(suburb, street, postal_code, interior_number, reference, exterior_number = null) {
    const address = {
        id: addresses.length + 1,
        suburb,
        street,
        postal_code,
        interior_number,
        reference,
        exterior_number,
    };

    addresses.push(address);
    console.log('Dirección registrada:', address);
    return address;
}

// Función para mostrar direcciones
function showAddresses() {
    if (addresses.length === 0) {
        console.log('No hay direcciones registradas.');
        return []; // Retorna un array vacío si no hay direcciones
    }

    console.log('Direcciones registradas:');
    addresses.forEach(address => {
        console.log(`ID: ${address.id}, ${address.street}, ${address.suburb}, CP: ${address.postal_code}`);
    });

    return addresses; // Retorna el array de direcciones
}

function selectAddress(id) {
    const address = addresses.find(address => address.id === id);

    if (!address) {
        console.log(`No se encontró una dirección con ID ${id}.`);
        return null;
    }

    console.log('Dirección seleccionada:', address);
    return address;
}

registerAddress(
    'Santa Cecilia',
    'Prol. 5 de Mayo',
    '27448',
    '842',
    'Casa verde con barandal blanco'
);

registerAddress(
    'Centro',
    'Av. Juárez',
    '12345',
    '101',
    'Edificio rojo frente a la plaza'
);

showAddresses();


//calcula el total del carrito
function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

//muestra los productos del carrito
function showCart() {
    if (cart.length === 0) {
        console.log('El carrito está vacío.');
        return;
    }

    console.log('Carrito de compras:');
    cart.forEach(item => {
        console.log(`- ${item.name}: ${item.quantity} x $${item.price} = $${item.quantity * item.price}`);
    });
    console.log(`Total: $${calculateCartTotal()}`);
}

//simula el pago
function simulatePayment(selectedAddressId) {
    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
        return { success: false, message: 'El carrito está vacío. Añade productos antes de realizar un pago.' };
    }

    // Validar que la dirección seleccionada exista
    const selectedAddress = selectAddress(selectedAddressId);
    if (!selectedAddress) {
        return { success: false, message: 'Por favor selecciona una dirección válida para el envío.' };
    }

    // Mostrar un resumen del pedido
    console.log('Resumen del pedido:');
    showCart();
    console.log(`Dirección de envío: ${selectedAddress.street}, ${selectedAddress.suburb}, CP: ${selectedAddress.postal_code}`);

    const total = calculateCartTotal();
    console.log(`Total a pagar: $${total}`);
    console.log('Procesando pago...');

    // Simulación del pago
    setTimeout(() => {
        console.log('¡Pago realizado con éxito! Gracias por tu compra.');
        cart.length = 0; // Vaciar el carrito
        console.log('El carrito ha sido vaciado.');
    }, 2000);

    return { success: true, message: 'Pago realizado con éxito.', total, address: selectedAddress };
}

function validarExistenciaUsuario(id) {
    return usuarios.find(usuario => usuario.id === id)
}

function eliminaUsuario(id) {
    if (validarExistenciaUsuario(id)) {
        let usuario = usuarios.find(usuario => usuario.id === id)
        usuarios.splice(usuarios.indexOf(usuario), 1)
        console.log(`Se ha eliminado el usuario con id ${id}`)
    } else {
        console.log(`El usuario con id ${id} no existe`)
    }
}
//Funcion para agregar un nuevo usuario
function agregaUsuario(id, nombre, apellido, email, contraseña) {
    if (validarExistenciaUsuario(id)) {
        console.log(`El usuario con id ${id} ya existe`)

    } else {
        usuarios.push({ id, nombre, apellido, email, contraseña })
        //user.create()
        console.log("Usuario agregado con exito!")
    }
}


export default usuarios;
export {
    menu,
    cart,
    isProductAvailable,
    hasSufficientStock,
    updateCartItem,
    addNewItemToCart,
    reduceStock,
    addToCart,
    registerAddress,
    showAddresses,
    selectAddress,
    calculateCartTotal,
    showCart,
    simulatePayment,
    agregaUsuario,
    eliminaUsuario,
    validarExistenciaUsuario,
}
