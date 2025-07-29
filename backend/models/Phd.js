//     import { application } from 'express';
// import { sequelize } from '../config/database';
//     import { DataTypes } from 'sequelize';

//     const Phd = sequelize.define('Phd', {
//         application_id: DataTypes.INTEGER,
//         status: DataTypes.STRING,
//         university: DataTypes.STRING,
//         year_of_passing: DataTypes.STRING,
//         net_score: DataTypes.STRING,
//         set_score: DataTypes.STRING,
//     })

//     return Phd;

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Phd = sequelize.define('Phd', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    topic: { type: DataTypes.STRING, allowNull: false },
    university: { type: DataTypes.STRING },
    year: { type: DataTypes.STRING },
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Phd.associate = (models) => {
    Phd.belongsTo(models.Application, { foreignKey: 'applicationId' });
  };

  return Phd;
};
