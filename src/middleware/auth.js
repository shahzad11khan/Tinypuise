const jwt = require("jsonwebtoken");

const authenticate = (resolver) => async (parent, args, context, info) => {
  const { authorization } = context.headers;

  if (!authorization) {
    throw new Error("Unauthorized: Missing token");
  }

  try {
    const token = authorization.split(" ")[1]; // Bearer TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    context.user = decoded; // Attach user data to context
    // console.log(context.user)
    return resolver(parent, args, context, info); // Proceed to resolver
  } catch (error) {
    throw new Error("Unauthorized: Invalid token");
  }
};

module.exports = authenticate;
