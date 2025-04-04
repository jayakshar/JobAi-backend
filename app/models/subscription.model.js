module.exports = (sequelize, Sequelize) => {
    const Subscription = sequelize.define("subscription", {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
        },
        price: {
            type: Sequelize.DECIMAL,
            allowNull: false,
        },
        time: {
            type: Sequelize.TIME,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
        type: {
            type: Sequelize.STRING,
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
        timestamps: false,          
        freezeTableName: true,     
    });

    return Subscription;
};
