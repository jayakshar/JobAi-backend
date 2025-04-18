module.exports = (sequelize, Sequelize) => {
    const Job = sequelize.define('job', {
      title: {
        type: Sequelize.STRING,
      },
      adjuna_id: {
        type: Sequelize.STRING,
        unique: true,
      },
      category: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT('long'),
      },
      location: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      company: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.STRING,
      },
      min_salary: {
        type: Sequelize.STRING,
      },
      max_salary: {
        type: Sequelize.STRING,
      },
      contract_type: {
        type: Sequelize.STRING,
      },
      job_url: {
        type: Sequelize.STRING,
      },
      contract_time: {
        type: Sequelize.STRING,
      },
      source: {
        type: Sequelize.STRING,
      },
      server_created_date: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    }, {
      tableName: 'job',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  
    return Job;
  };
  