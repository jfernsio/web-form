import { DataTypes } from 'sequelize';


export default (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Username: { type: DataTypes.STRING, allowNull: false , unique: true , validate:{
        notEmpty: {
            msg: 'Username cannot be empty'
        }
    } },
    Password: { type: DataTypes.STRING, allowNull: false,validate:{
          validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        },}
    } },

  });

  return User;
};
