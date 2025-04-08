module.exports = (sequelize, Sequelize) => {
    const Loopemails = sequelize.define('loop_emails', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        loop_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
        },
        email_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
        },
        title : {
            type: Sequelize.STRING
        },
        subject: {
            type: Sequelize.STRING
        },
        body: {
            type: Sequelize.TEXT
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },   
    },{
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return Loopemails;
}