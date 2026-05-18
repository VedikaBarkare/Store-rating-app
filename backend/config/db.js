// Used to connect Node.js to MySQL database using Sequelize 

import { Sequelize } from "sequelize";
import dotenv from "dotenv";


dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql" // Tells Sequelize: which database are we using?
  }
)

export default sequelize;