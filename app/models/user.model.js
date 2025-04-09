module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        first_name: {
            type: Sequelize.STRING,
        },
        last_name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
        },
        mobile: {
            type: Sequelize.STRING,
        },
        photo_url: {
            type: Sequelize.STRING,
        },
        email_verified_at: {
            type: Sequelize.DATE,
        },
        password: {
            type: Sequelize.STRING,
        },
        remember_token: {
            type: Sequelize.STRING,
        },
        cv_path: {
            type: Sequelize.STRING,
        },        
        google_id: {
            type: Sequelize.STRING,
        },
        facebook_id: {
            type: Sequelize.STRING,
        },
        subscription_id: {
            type: Sequelize.STRING,
        },
        expiry_date: {
            type: Sequelize.DATE,
        },
        is_block: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        role: {
            type: Sequelize.STRING,
            defaultValue: 'candidate', // 👈 Default role
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
        },
        signup_by: {
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
    });
    return User;
};
