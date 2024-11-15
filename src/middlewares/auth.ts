import { FastifyReply, FastifyRequest } from 'fastify';

const authByHeadder = async (request: FastifyRequest, reply: FastifyReply) => {
  const apiKey = request.headers['x-api-key'];
  if (!apiKey || apiKey !== '12345abcde') {
    reply.status(401).send({ message: 'Unauthorized' });
  }
};

export default authByHeadder;
