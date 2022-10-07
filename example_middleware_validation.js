const userSchema = JOI.object().keys({
    fullName: JOI.string().required(),
    email: JOI.string().email().required(),
    password: JOI.string().required(),
    role: JOI.string().valid("pro", "center", "model").required(),
    location: JOI.string().required(),
    image: JOI.string().required(),
});

exports.userCreate = (req, res, next) => {
    const result = userSchema.validate(req.body);
    if (result.error) {
        return res.status(400).json({
            status: false,
            message: result.error.message
        });
    } else {
        next();
    }
};