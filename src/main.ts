import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const options = new DocumentBuilder()
    .setTitle('Product Search')
    .setDescription('The search API description')
    .setVersion('1.0.0')
    .addTag('search')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document)


  app.getHttpAdapter().getInstance()
    .addContentTypeParser(
      ['text/xml', 'application/xml'],
      { parseAs: 'string' },
      function (req, body, done) {
        done(null, body)
      }
    )

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
