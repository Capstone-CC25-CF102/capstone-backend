import { Sequelize } from 'sequelize';
import db from '../config/database.js';

const { DataTypes } = Sequelize;

const Places = db.define(
  'places',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255), 
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // image: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    //   validate: {
    //     isUrl: { msg: 'Image must be a valid URL' }, 
    //   },
    // },
    rating: {
      type: DataTypes.TEXT,
        allowNull: true,
    },
    adress: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    province: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
  },
  {
    freezeTableName: true, 
    timestamps: false, 
    tableName: 'places', 
  }
);

export default Places;