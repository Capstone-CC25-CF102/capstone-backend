import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import Users from './UserModel.js';
import Places from './PlaceModel.js';

const { DataTypes } = Sequelize;

const Wishlist = db.define('wishlists', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  timestamps: true
});

Users.hasMany(Wishlist, { foreignKey: 'userId' });
Wishlist.belongsTo(Users, { foreignKey: 'userId' });

Places.hasMany(Wishlist, { foreignKey: 'placeId' });
Wishlist.belongsTo(Places, { foreignKey: 'placeId' });

export default Wishlist;
  