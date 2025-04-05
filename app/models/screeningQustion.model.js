module.exports = (sequelize, Sequelize) => {
    const ScreeningQuestion = sequelize.define("screenigs_question", {
        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
        },
        linkedin_url: {
            type: Sequelize.STRING,
        },
        working_for_canada: {
            type: Sequelize.BOOLEAN,
        },
        notice_period: {
            type: Sequelize.STRING,
        },
        expected_salary: {
            type: Sequelize.DECIMAL,
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

    return ScreeningQuestion;
};
