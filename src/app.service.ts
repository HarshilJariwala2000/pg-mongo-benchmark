import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ProductData, ProductMetadata } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as fs from 'fs'
import * as xlsx from 'xlsx'

interface flipkartData{
	product_specifications:{

	}
}

@Injectable()
export class AppService {

	constructor(
		@InjectRepository(ProductData) private productDataRepository: Repository<ProductData>,
		@InjectRepository(ProductMetadata) private productMetadataRepository: Repository<ProductMetadata>,
		private dataSource: DataSource
	){}



	async excelToJson(){
		const workbook = xlsx.readFile('flipkart_com-ecommerce_sample.csv')
		const sheet_name_list = workbook.SheetNames;
		fs.writeFileSync('flipkart.json', JSON.stringify(xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])))
	}

	async extractJSON(){
		const data = fs.readFileSync('flipkart.json')
		const json = JSON.parse(data.toString())
		const y = []
		for(let x of json){
			// console.log(x)
			if(x.product_specifications===undefined || x.product_specifications===null)
				continue
			console.log(x.product_specifications)
			// const string = x.product_specifications.replace('=>', ':')
			const string = x.product_specifications.toString().split('=>').join(':')
			if(string==='{"product_specification":nil}')
				continue
			y.push(JSON.parse(string))
		}
		fs.writeFileSync('attributevalue.json', JSON.stringify(y))
	}

	async addRandomValues(){
		const data = fs.readFileSync('final2.json')
		const json = JSON.parse(data.toString())
		
	}

	async mergeAttributes(){
		const data = fs.readFileSync('final.json')
		const json = JSON.parse(data.toString())
		let i = 1
		for(let oldKey in json){
			// const newKey = oldKey.toLowerCase().split(' ').join('_') + `_${i}`
			// json[newKey] = [...json[oldKey]]
			// delete json[oldKey]
			// i++
			if(json[oldKey].length<=1)
				continue
			i++
		}
		console.log(i)
		// fs.writeFileSync('final2.json', JSON.stringify(json, null, 2))
		// const a = json.flatMap(x=>x.product_specification)
		// a.forEach(x=>{
		// 	if(x.key===undefined)
		// 		x['key'] = 'other'
		// 	if(x.value===undefined)
		// 		x['value'] = uuidv4()
		// })
		// const result = a.reduce(function (r, a) {
		// 	r[a.key] = r[a.key] || [];
		// 	if(!r[a.key].includes(a.value))
		// 		r[a.key].push(a.value);
		// 	return r;
		// }, Object.create(null));
		// fs.writeFileSync('final.json', JSON.stringify(result))
	}

	async getData(){
		return await this.dataSource.manager.query(`select * from product_data
		inner join product_metadata on 
		product_data.pdm_id = product_metadata.pdm_id
			order by product_data.code
		limit 10 offset 0;`)
	}

	async insertData(){
		// const data = []
		// for(let i = 4;i<50; i++){
		// 	console.log(i)
			// const fileName = `data${i}.json`
			// fs.writeFileSync(fileName, '[')
			const limit = 100000
			for(let i=0; i<limit;i++){
				if(i%1000===0)
					console.log(i)
				const productData:ProductData = {
					pdm_id:undefined,
					category_id:333,
					tenant_id:'IN0001',
					org_id:'OR0001',
					code:uuidv4(),
					product_name:`Dummy`,
					product_data:{
						"description_466":"Desc",
						"highlights_716":"High",
						"color_243":4,
						"upper_material_271":58,
						"uuid":uuidv4()
					},
					variant_data:{},
					variant_dependent_data:{}
				}
				const x = (await this.productDataRepository.insert(productData)).identifiers
				// console.log(x)
				const pdmId = x[0].pdm_id
				const productMetadata:ProductMetadata = {
					pdm_id:pdmId, 
					parent_pdm_id:null,
					category_id:333,
					tenant_id:'IN0001',
					org_id:'OR0001',
					other_variant:[],
					status:true,
					classification:'Normal',
					completion_percentage:100
				}
				// console.log(productMetadata)
				await this.productMetadataRepository.insert(productMetadata)
				// const comma = i===limit-1?``:`,`
				// fs.appendFileSync(fileName, `${JSON.stringify({
				// 	product_data:productData,
				// 	product_metadata:productMetadata
				// })}${comma}`)
			}
			// fs.appendFileSync(fileName, `]`)
		// }
		// fs.writeFileSync('data.json', JSON.stringify(data))
	}

	async insertVariantData(){
		// for(let i=1;i<6;i++){
				const limit = 500000
				for(let i=0; i<limit;i++){
					if(i%1000===0)
						console.log(i)
					const productData:ProductData = {
						pdm_id:undefined,
						category_id:333,
						tenant_id:'IN0001',
						org_id:'OR0001',
						code:uuidv4(),
						product_name:`Dummy`,
						product_data:{
							"description_466":"Desc",
							"highlights_716":"High",
							"color_243":4,
							"upper_material_271":58,
							"uuid":uuidv4()
						},
						variant_data:{},
						variant_dependent_data:{}
					}
					const x = (await this.productDataRepository.insert(productData)).identifiers
					const pdmId = x[0].pdm_id
					const productMetadata:ProductMetadata = {
						pdm_id:pdmId, 
						parent_pdm_id:null,
						category_id:333,
						tenant_id:'IN0001',
						org_id:'OR0001',
						other_variant:[316, 317],
						status:true,
						classification:'Style',
						completion_percentage:100
					}
					await this.productMetadataRepository.insert(productMetadata)
					// const comma = i===limit-1?``:`,`

		
					////////////////////////////////////////////
					const productData1:ProductData = {
						pdm_id:undefined,
						category_id:333,
						tenant_id:'IN0001',
						org_id:'OR0001',
						code:uuidv4(),
						product_name:`Dummy`,
						product_data:productData.product_data,
						variant_data:{
							"euro_size_316":[120],
							"euro_color_317":[111]
						},
						variant_dependent_data:{
							"barcode_1475":uuidv4()
						}
					}
					const x1 = (await this.productDataRepository.insert(productData1)).identifiers
					const pdmId1 = x1[0].pdm_id
					const productMetadata1:ProductMetadata = {
						pdm_id:pdmId1, 
						parent_pdm_id:pdmId,
						category_id:333,
						tenant_id:'IN0001',
						org_id:'OR0001',
						other_variant:[316, 317],
						status:true,
						classification:'Variants',
						completion_percentage:100
					}
					await this.productMetadataRepository.insert(productMetadata1)

					////////////////////////////////////////////////////
					const productData2:ProductData = {
						pdm_id:undefined,
						category_id:333,
						tenant_id:'IN0001',
						org_id:'OR0001',
						code:uuidv4(),
						product_name:`Dummy`,
						product_data:productData.product_data,
						variant_data:{
							"euro_size_316":[120],
							"euro_color_317":[222]
						},
						variant_dependent_data:{
							"barcode_1475":uuidv4()
						}
					}
					const x2 = (await this.productDataRepository.insert(productData2)).identifiers
					const pdmId2 = x2[0].pdm_id
					const productMetadata2:ProductMetadata = {
						pdm_id:pdmId2, 
						parent_pdm_id:pdmId,
						category_id:333,
						tenant_id:'IN0001',
						org_id:'OR0001',
						other_variant:[316, 317],
						status:true,
						classification:'Variants',
						completion_percentage:100
					}
					await this.productMetadataRepository.insert(productMetadata2)


					//////////////////////////////////////
					const productData3:ProductData = {
						pdm_id:undefined,
						category_id:333,
						tenant_id:'IN0001',
						org_id:'OR0001',
						code:uuidv4(),
						product_name:`Dummy`,
						product_data:productData.product_data,
						variant_data:{
							"euro_size_316":[120],
							"euro_color_317":[333]
						},
						variant_dependent_data:{
							"barcode_1475":uuidv4()
						}
					}
					const x3 = (await this.productDataRepository.insert(productData3)).identifiers
					const pdmId3 = x3[0].pdm_id
					const productMetadata3:ProductMetadata = {
						pdm_id:pdmId3, 
						parent_pdm_id:pdmId,
						category_id:333,
						tenant_id:'IN0001',
						org_id:'OR0001',
						other_variant:[316, 317],
						status:true,
						classification:'Variants',
						completion_percentage:100
					}
					await this.productMetadataRepository.insert(productMetadata3)

				}
		
		
				// fs.appendFileSync(fileName, `]`)
			// }
	}
}
