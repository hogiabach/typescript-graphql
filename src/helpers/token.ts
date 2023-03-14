import * as jsonwebtoken from "jsonwebtoken";

const generateToken = (id: string, email: string) => {
  return jsonwebtoken.sign(
    {
      id,
      email,
    },
    "NHY4MmkK",
    { expiresIn: "1y" }
  );
};

export default generateToken;
