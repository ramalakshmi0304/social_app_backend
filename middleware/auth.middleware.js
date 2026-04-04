export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    console.log("AUTH FAIL: User not found in DB");
    return res.status(401).json({ message: "User no longer exists" });
  }

  console.log("AUTH SUCCESS: Proceeding to next middleware/controller");
  next(); 
} catch (error) {
  console.log("AUTH FAIL: JWT Verification failed");
  res.status(401).json({ message: "Not authorized" });
}
};