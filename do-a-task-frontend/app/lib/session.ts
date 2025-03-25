import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "super-secret"

export async function decrypt(token: string) {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error('No token provided'));
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}