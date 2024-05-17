import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

	@Post('/insertData')
	async insertData() {
		return await this.appService.mergeAttributes()
	}
}
