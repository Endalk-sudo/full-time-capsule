export const errorHandler = (err, req, res, next) => {
    console.error(err);

    const status = err.status ?? 500;
    res.status(status).json({
        error: status < 500 ? err.message : 'Internal server error',
        code: err.code,
    });
};
