

    // const Qualification = sequelize.define('Qualification', {
    //     application_id: DataTypes.INTEGER,
    //     degree: DataTypes.STRING,
    //     degree_name: DataTypes.STRING,
    //     education_mode: DataTypes.STRING,
    //     university: DataTypes.STRING,
    //     specialization: DataTypes.STRING,
    //     year_of_passing: DataTypes.STRING,
    //     percentage: DataTypes.STRING,
    //     cgpa: DataTypes.STRING,
    // })

    // return Qualification;

    import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Qualification = sequelize.define('Qualification', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    degree: { type: DataTypes.STRING, allowNull: false },
    institution: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.STRING, allowNull: false },
    grade: { type: DataTypes.STRING },
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Qualification.associate = (models) => {
    Qualification.belongsTo(models.Application, { foreignKey: 'applicationId' });
  };

  return Qualification;
};
