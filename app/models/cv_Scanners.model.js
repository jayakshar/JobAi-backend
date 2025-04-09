module.exports = (sequelize, Sequelize) => {
    const CVScanner = sequelize.define('cv_scanners', {
        user_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        cv_file: {
            type: Sequelize.STRING
        },
        cv_score: {
            type: Sequelize.INTEGER
        },
        ai_response: {
            type: Sequelize.TEXT("long")
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

    return CVScanner;
}