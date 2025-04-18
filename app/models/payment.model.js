module.exports = (sequelize, Sequelize) => {
    const Payments = sequelize.define('payments', {
        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
        },
        subscription_id: {
            type: Sequelize.BIGINT.UNSIGNED,
        },
        // request_id: {
        //     type: Sequelize.BIGINT.UNSIGNED,
        //     allowNull: true
        // },
        price: {
            type: Sequelize.DECIMAL(10, 2),
        },
        total_amount: {
            type: Sequelize.DECIMAL(10,2),
        },
        source: {
            type: Sequelize.STRING,
        },
        payment_status: {
            type: Sequelize.ENUM('pending', 'completed', 'failed'),
            defaultValue: 'pending'
        },
        transaction_id: {
            type: Sequelize.STRING,
            allowNull : true
        },
        transaction_data: {
            type: Sequelize.JSON,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        }
    },{
        timestamps: false
    });

    return Payments;
}