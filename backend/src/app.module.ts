import { AuthModule } from '@/auth/auth.module';
import jwtConfig from '@/auth/config/jwt.config';
import { CartModule } from '@/cart/cart.module';
import appConfig from '@/config/app.config';
import { MailModule } from '@/mail/mail.module';
import databaseConfig from '@/config/database.config';
import sepayConfig from '@/config/sepay.config';
import { validationSchema } from '@/config/validation.schema';
import { SnakeCaseNamingStrategy } from '@/config/snake-case-naming.strategy';
import { ProductsModule } from '@/products/products.module';
import { OrdersModule } from '@/orders/orders.module';
import { PaymentsModule } from '@/payments/payments.module';
import { AppController } from '@/app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from '@/app.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@/auth/guards/authentication/authentication.guard';
import { AccessTokenGuard } from '@/auth/guards/access-token/access-token.guard';
import { AdminModule } from '@/admin/admin.module';
import { ReviewsModule } from './reviews/reviews.module';

/**
 * Module chính của ứng dụng
 */
@Module({
  imports: [
    // Cấu hình ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, sepayConfig],
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
      validationSchema,
    }),
    // Cấu hình ScheduleModule
    ScheduleModule.forRoot(),
    // Cấu hình TypeOrmModule
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        namingStrategy: new SnakeCaseNamingStrategy(),
      }),
    }),
    AuthModule,
    MailModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    PaymentsModule,
    AdminModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
