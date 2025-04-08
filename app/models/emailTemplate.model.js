module.exports = (sequelize, Sequelize) => {
    const Email = sequelize.define('emails', {
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('draft', 'sent', 'failed'),
        defaultValue: 'draft'
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
      updatedAt: 'updated_at',
    });
  
    return Email;
  };
  