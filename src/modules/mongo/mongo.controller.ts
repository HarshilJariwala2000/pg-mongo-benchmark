import { Body, Controller, Post } from '@nestjs/common';
import {MongoService} from '../mongo/mongo.service'

@Controller(`/mongo`)
export class MongoController {
    constructor(private readonly mongoservice: MongoService){}

    @Post('/create')
	async insertData(@Body() body: any) {
        console.log(body);
		return await this.mongoservice.createProduct(body.product_data,body.product_metadata)
	}
}
