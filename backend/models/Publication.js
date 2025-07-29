    // import { sequelize } from '../config/database';
    // import { DataTypes } from 'sequelize';

    // const Publication = sequelize.define('Publication', {
    //     application_id: DataTypes.INTEGER,
    //     scoups_indexed: DataTypes.STRING,
    //     scoups_id: DataTypes.STRING,
    //     presented_at_conference: DataTypes.STRING,
    //     paper_title: DataTypes.STRING,
    //     journal_name: DataTypes.STRING,
    //     publication_date: DataTypes.STRING,
    //     no_of_approved_papers: DataTypes.STRING,
    // })

    // return Publication;
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Publication = sequelize.define('Publication', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    journal: { type: DataTypes.STRING },
    year: { type: DataTypes.STRING },
    applicationId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Publication.associate = (models) => {
    Publication.belongsTo(models.Application, { foreignKey: 'applicationId' });
  };

  return Publication;
};
