import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const BEd = sequelize.define('BEd', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bedUniversity: { type: DataTypes.STRING, allowNull: false },
    bedYear: { type: DataTypes.STRING, allowNull: false },
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
  });

  BEd.associate = (models) => {
    BEd.belongsTo(models.Application, { foreignKey: 'applicationId' });
  };

  return BEd;
};
