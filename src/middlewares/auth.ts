import { FastifyReply, FastifyRequest } from 'fastify';

const authByHeadder = async (request: FastifyRequest, reply: FastifyReply) => {
  const apiKey = request.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.X_API_KEY) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
};

export default authByHeadder;
