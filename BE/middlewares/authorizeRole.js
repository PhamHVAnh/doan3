exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.maVT)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
};
