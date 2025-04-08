module.exports = (sequelize, Sequelize) => {
    const LoopSettings = sequelize.define('loop_settings', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        loop_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false
        },
        auto_send_emails: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        },
        auto_fill_application: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            validate: {
                isIn: [[0, 1]]
            }
        },
        cover_letter: {
            type: Sequelize.TEXT
        },
        excluded_company: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return LoopSettings;
};
