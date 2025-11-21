import { DataTypes } from "sequelize";

export default (sequelize) => {
  const AdditionalInfo = sequelize.define("AdditionalInfo", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    referenceName: { type: DataTypes.TEXT ,allowNull: true },
    appliedFor: { type: DataTypes.TEXT,allowNull: true },  
    currentSalary: { type: DataTypes.TEXT ,allowNull: false },
    expectedSalary: { type: DataTypes.TEXT ,allowNull: false},
    extraCurricular: { type: DataTypes.TEXT ,allowNull: true},
    motherTongue: { type: DataTypes.STRING, allowNull: true},
    otherLang: { type: DataTypes.STRING, allowNull: true},
    engTypingSpeed: { type: DataTypes.STRING, allowNull: true},
    marTypingSpeed: { type: DataTypes.STRING, allowNull: true},
    comment: { type: DataTypes.TEXT, allowNull: true},
    joiningDate:{ type: DataTypes.STRING, allowNull: true},
    applicationId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  });

  AdditionalInfo.associate = (models) => {
    AdditionalInfo.belongsTo(models.Application, {
      foreignKey: "applicationId",
    });
  };

  return AdditionalInfo;
};
