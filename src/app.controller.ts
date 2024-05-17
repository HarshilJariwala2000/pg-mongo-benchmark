import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

	@Post('/insertData')
	async insertData() {
		// const x = await this.appService.getQuery()
		// console.log(x.length)
		// return x
	}
	@Post('/getProduct')
	async getprd(@Body() body){
		return this.appService.getQuery(body)
	}
}
