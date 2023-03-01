import {
  Catch,
  createHandler,
  Get,
  HttpException,
} from 'next-api-decorators';
import type { NextApiRequest, NextApiResponse } from 'next';

const exceptionHandler = (error: unknown, req: NextApiRequest, res: NextApiResponse) => {
  if (!(error instanceof HttpException)) {
    console.warn('Unhandled error for url', error, req?.url);
    res.status(500).send('Unhandled error');
    return;
  }
  res.status(error?.statusCode ?? 500).send(error?.message ?? 'Unhandled');
};

const delayMS = (delay:number) => new Promise<void>((resolve) => (setTimeout(resolve, delay)));

@Catch(exceptionHandler)
class SomeHandler {

  @Get()
  async doIt() {
    await delayMS(200);
    throw new HttpException(404, 'Some error message');
  }   
}

export default createHandler(SomeHandler);