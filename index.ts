require('dotenv').config();
import express from 'express';
import router from './routes/user_router';

const app = express();
app.use(express.json());
app.use('/v1/api', router);

const PORT = process.env.PORT || 3036;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { Sequelize } from "sequelize";

const sequelize = new Sequelize("node", "root", "8721", {
  host: "127.0.0.1",
  dialect: "mysql",
});

export default sequelize;

