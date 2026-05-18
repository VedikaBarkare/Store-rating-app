import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Rating = sequelize.define("Rating",{

    rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
})

export default Rating;