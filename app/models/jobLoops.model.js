module.exports = (sequelize, Sequelize) => {
    const JobLoop = sequelize.define('job_loops', {
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      is_remote: {
        type: Sequelize.BOOLEAN
      },
      experience: {
        type: Sequelize.STRING
      },
      job_type: {
        type: Sequelize.STRING
      },
      updated_cv: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      total_applied_jobs: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt : 'updated_at'

    });
  
    return JobLoop;
  };
  