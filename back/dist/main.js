import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: true,
        methods: ['GET', 'HEAD', 'OPTIONS'],
    });
    app.setGlobalPrefix('api');
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🏀 Courtside NBA Backend (NestJS) running on http://localhost:${port}/api`);
}
await bootstrap();
//# sourceMappingURL=main.js.map