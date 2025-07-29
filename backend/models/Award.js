//     import { sequelize } from '../config/database';
//     import { DataTypes } from 'sequelize';


// const Award = sequelize.define('Award', {
//     application_id: DataTypes.INTEGER,
//     awardName: DataTypes.STRING,
//     year: DataTypes.STRING,
//     description: DataTypes.TEXT,
//   });

//   return Award;

// export default Award;

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Award = sequelize.define('Award', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Award.associate = (models) => {
    Award.belongsTo(models.Application, { foreignKey: 'applicationId' });
  };

  return Award;
};
