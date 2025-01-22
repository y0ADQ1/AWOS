import * as Express from 'express';
import User from '../db/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import usuarios from "../Controllers/apiController";
import {
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
} from "../Controllers/apiController";

const router = Express.Router();

router.get("/", function (request, response, next) {
    console.log("Hola soy un servicio")
})

router.get("/usuarios", function (request, response, next) {
  response.json(usuarios)
})

router.post("/creaUsuario", function (request, response, next) {
    agregaUsuario(request.body.id, request.body.nombre, request.body.apellido, request.body.email, request.body.contraseña)

    response.json(usuarios)
})

router.post("/eliminaUsuario", function (request, response, next) {
    eliminaUsuario(request.body.id)

    response.json(usuarios)
})

// Ruta para registrar una dirección
router.post('/registerAddress', (request, response) => {
    const { suburb, street, postal_code, interior_number, reference, exterior_number } = request.body;

    // Validar datos requeridos
    if (!suburb || !street || !postal_code || !interior_number || !reference) {
        response.status(200).send('Menú mostrado en la consola.');
    }

    const address = registerAddress(suburb, street, postal_code, interior_number, reference, exterior_number);
    response.status(201).json({ message: 'Dirección registrada con éxito.', address });
});

// Ruta para obtener todas las direcciones
router.get('/showAddresses', (req, res) => {
    const allAddresses = showAddresses(); // Llama a la función para obtener las direcciones
    res.json(allAddresses); // Devuelve las direcciones como JSON
});

// Ruta para seleccionar una dirección por ID
router.post('/selectAddress', (req, res) => {
    const { id } = req.body; // Obtiene el ID del cuerpo de la solicitud
    const selectedAddress = selectAddress(id); // Llama a la función selectAddress

    if (!selectedAddress) {
        // Si no se encuentra la dirección, responde con un error
        res.status(201).json({ message: 'No se encontro la direccion.'});
    }

    // Si se encuentra la dirección, la envía como respuesta
    res.json(selectedAddress);
});

router.get("/menu", function (request, response, next) {
    response.json(menu)
})

router.post("/addToCart", function (request, response, next) {
    const { productId, quantity } = request.body;

    if (!isProductAvailable(productId)|| !quantity || quantity <= 0) {
         response.status(400).send('Producto no encontrado o que la cantidas sea > 0.');
    }
    try {
        addToCart(productId, quantity); // Ejecuta la lógica
        response.json({ success: true, message: `Producto añadido al carrito.` });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
})

router.get("/showCart", function (request, response, next) {
    response.json(cart); // Devuelve el contenido del carrito
});

router.post("/simulatePayment", (request, response, next) => {
    const { selectedAddressId } = request.body; // Obtener la dirección seleccionada desde el cuerpo

    if (!selectedAddressId) {
        response.status(400).json({ success: false, message: 'El ID de la dirección es obligatorio.' });
    }

    try {
        const result = simulatePayment(selectedAddressId);

        if (!result.success) {
            response.status(400).json(result);
        }

        response.json(result); // Devolver el resultado del pago
    } catch (error) {
        console.error('Error procesando el pago:', error);
        response.status(500).json({ success: false, message: 'Ocurrió un error procesando el pago.' });
    }
});


router.get('/users', async function (req, res, next){
    const users = await User.findAll();
    res.json(users);
})

// Crear usuario con contraseña hasheada
router.post('/createUser', async (req, res, next) => {
    try {
        const { name, last_name, age, email, password } = req.body;

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await User.create({
            name,
            last_name,
            age,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// Actualizar usuario (con soporte para hashear nueva contraseña)
router.put('/updateUser', async (req, res, next) => {
    const { id, name, last_name, age, email, password } = req.body;

    if (!id) {
         res.status(400).json({ message: 'Se requiere un ID para actualizar.' });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
             res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Hashear la nueva contraseña si es proporcionada
        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

        const updatedUser = await user.update({
            name: name || user.name,
            last_name: last_name || user.last_name,
            age: age || user.age,
            email: email || user.email,
            password: hashedPassword,
            updatedAt: new Date(),
        });

        res.status(200).json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// Login del usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
             res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Comparar la contraseña ingresada con el hash almacenado
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
             res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar token JWT
        const secret = process.env.JWT_SECRET || 'secret_key';
        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;

