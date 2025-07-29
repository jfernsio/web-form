    // import { sequelize } from '../config/database';
    // import { DataTypes, DATE } from 'sequelize';

    // const Course = sequelize.define('Course', {
    //     application_id: DataTypes.INTEGER,  
    //     college_name: DataTypes.STRING,
    //     class_name: DataTypes.STRING,
    //     subject_name: DataTypes.STRING,
    //     years_of_exp: DataTypes.STRING,
    //     from_date: DataTypes.STRING,
    //     to_date: DataTypes.STRING,
    //     department: DataTypes.STRING,
    //     type_of_contract: DataTypes.STRING,
    //     last_salary: DataTypes.STRING,
    //     approved_by_uni: DataTypes.STRING,
    //     letter_num: DataTypes.STRING,
    //     letter_date: DataTypes.STRING,   
    // })

    // return Course;

    import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    course_name: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.STRING },
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Course.associate = (models) => {
    Course.belongsTo(models.Application, { foreignKey: 'applicationId' });
  };

  return Course;
};
