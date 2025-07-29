    // import { sequelize } from '../config/database';
    // import { DataTypes } from 'sequelize';

    // const AdditionalInfo = sequelize.define('AdditionalInfo', {
    //     application_id: DataTypes.INTEGER,
    //     refernce_name: DataTypes.STRING,
    //     applied_for: DataTypes.STRING,
    //     current_salary: DataTypes.STRING,
    //     expected_salary: DataTypes.STRING,
    //     extra_curricular: DataTypes.TEXT,
    // })
    // return AdditionalInfo;

    import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const AdditionalInfo = sequelize.define('AdditionalInfo', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hobbies: { type: DataTypes.TEXT },
    strengths: { type: DataTypes.TEXT },
    declaration: { type: DataTypes.TEXT },
    applicationId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  });

  AdditionalInfo.associate = (models) => {
    AdditionalInfo.belongsTo(models.Application, { foreignKey: 'applicationId' });
  };

  return AdditionalInfo;
};
