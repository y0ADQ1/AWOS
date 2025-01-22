require('dotenv').config();
import { DataTypes, Sequelize } from 'sequelize';
import { Model } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
})

// Define la interfaz de atributos del usuario
interface UserAttributes {
    id: number;
    name: string;
    last_name: string;
    age: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

// Extiende la clase Model para usar los tipos
export default class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public last_name!: string;
    public age!: number;
    public email!: string;
    public password!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Define la tabla y los campos
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: { // Campo nuevo
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true, // Aseguramos unicidad del email
            validate: {
                isEmail: true, // Validación para asegurar un formato de correo válido
            },
        },
        password: { // Campo nuevo
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize, // Instancia de Sequelize que contiene tu conexión
        modelName: 'User', // Nombre del modelo
        tableName: 'Users', // Nombre de la tabla en tu base de datos
        timestamps: false, // Usa `true` si deseas timestamps automáticos
    }
);