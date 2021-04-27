const commentRoutes = require('./routes');

const constructorMethod = app => {
    app.use("/", commentRoutes);

    app.use("*", (req, res) => {
        res.status(404);
    });
};

module.exports = constructorMethod;
