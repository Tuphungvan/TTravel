function ensureActive(req, res, next) {
    if (!req.session.user || req.session.user.active === false) {
        return res.status(403).render('login', { errorMessage: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin." });
    }
    next();
}

module.exports = ensureActive;
