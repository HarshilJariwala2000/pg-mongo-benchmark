import { Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongoController } from './mongo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {product_data,Product_data} from '../../models/product.schema'
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';
import { Product_Metadata, product_metadata } from '../../models/product_metadata.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:product_data.name,
      schema:Product_data
    },{
      name:product_metadata.name,
      schema:Product_Metadata
    }
  ])
  ],
  providers: [MongoService],
  exports:[MongoService],
  controllers: [MongoController]
})
export class MongoModule {}
