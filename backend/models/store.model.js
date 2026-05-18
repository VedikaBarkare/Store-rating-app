import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Store = sequelize.define("Store",{
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  address:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT, 
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
})

export default Store;