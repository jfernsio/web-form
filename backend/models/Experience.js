    // import { sequelize } from '../config/database';
    // import { DataTypes } from 'sequelize';

    // const Experience = sequelize.define('Experience', {
    //     application_id: DataTypes.INTEGER,
    //     organization_name: DataTypes.STRING,
    //     desgination: DataTypes.STRING,
    //     from_date: DataTypes.STRING,
    //     to_date: DataTypes.STRING,
    //     currently_working: DataTypes.STRING,
    //     current_salary: DataTypes.STRING,
    // })

    // return Experience;  

    import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Experience = sequelize.define('Experience', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organization: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    from: { type: DataTypes.DATE, allowNull: false },
    to: { type: DataTypes.DATE },
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Experience.associate = (models) => {
    Experience.belongsTo(models.Application, { foreignKey: 'applicationId' });
  };

  return Experience;
};
