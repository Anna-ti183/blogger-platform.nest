import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { appSetup } from './setup/app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app);
 
    const PORT = process.env.PORT || 5017; //TODO: move to configService. will be in the following lessons

   await app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}

bootstrap();
