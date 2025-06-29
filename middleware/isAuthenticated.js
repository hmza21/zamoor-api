export default (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).send('Not logged in');
}