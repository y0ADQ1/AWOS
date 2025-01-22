import * as express from 'express';
import  showMenu  from '../order_online.js';

const router = express.Router();

router.get('/', (req, res) => {
  console.log('hola soy un servicio');
  res.sendStatus(200);
});

router.get('/order_online.js', (req, res) => {
  console.log('Mostrando el menú:');
  showMenu();
  res.status(200).send('Menú mostrado en la consola.');
});

export default router;
