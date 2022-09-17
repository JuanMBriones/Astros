// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

/**
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
  res.status(200).json({
    name: 'John Doe',
  });
};
