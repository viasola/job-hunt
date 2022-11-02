module.exports = (sequelize, Sequelize) => {
  const Pagination = sequelize.define("pagination", {
    company: {
      type: Sequelize.TEXT,
    },
    position: {
      type: Sequelize.TEXT,
    },
    date_applied: {
      type: Sequelize.DATEONLY,
    },
    notes: {
      type: Sequelize.STRING,
    },
    tags: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.TEXT,
    },
  });

  return Pagination;
};
