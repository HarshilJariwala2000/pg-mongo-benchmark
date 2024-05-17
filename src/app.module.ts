import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductData, ProductMetadata } from './entity';

@Module({
    imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password:'pass',
			database: 'governance_json',
			entities: [ProductData, ProductMetadata],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([ProductData, ProductMetadata])
  	],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
