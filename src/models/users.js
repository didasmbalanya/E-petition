export default (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });
  users.associate = (models) => {
    users.hasMany(models.petitions, {
      foreignKey: 'user_id',
    });
    users.hasMany(models.votes, {
      foreignKey: 'user_id',
    });
    users.hasMany(models.flags, {
      foreignKey: 'user_id',
    });
  };
  return users;
};
