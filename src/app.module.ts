import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAttributeMapping, ProductData, ProductMetadata,AttributeSetOfValues } from './entity';
import { MongoModule } from './modules/mongo/mongo.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password:'pass',
			database: 'governance_json',
			entities: [ProductData, ProductMetadata, CategoryAttributeMapping, AttributeSetOfValues],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([ProductData, ProductMetadata, CategoryAttributeMapping, AttributeSetOfValues]),
		MongoModule,
		MongooseModule.forRoot('mongodb://localhost:27017/test'),
  	],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
