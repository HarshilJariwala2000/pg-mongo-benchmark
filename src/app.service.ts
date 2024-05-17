import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AttributeSetOfValues, CategoryAttributeMapping, ProductData, ProductMetadata } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as fs from 'fs'
import * as xlsx from 'xlsx'
import { MongoService } from './modules/mongo/mongo.service';

interface flipkartData{
	product_specifications:{

	}
}

@Injectable()
export class AppService {

	constructor(
		@InjectRepository(ProductData) private productDataRepository: Repository<ProductData>,
		@InjectRepository(ProductMetadata) private productMetadataRepository: Repository<ProductMetadata>,
		@InjectRepository(CategoryAttributeMapping) private categoryAttributeMappingRepository: Repository<CategoryAttributeMapping>,
		@InjectRepository(AttributeSetOfValues) private attributeSetOfValuesRepository: Repository<AttributeSetOfValues>,
		private readonly mongoService:MongoService,
		
		private dataSource: DataSource
	){}

	5

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
		for(let key in json){
			if(json[key].length<15){
				console.log(json[key].length)
				const size = Math.ceil(Math.random() * (2000 - 150) + 150)
				for(let i=0;i<size;i++){
					json[key].push(uuidv4())
				}
			}
		}
		fs.writeFileSync('final3.json', JSON.stringify(json))

	}

	async generateNoAttributesCategory(){
		const x = {}
		for(let i=1; i<=300; i++){
			x[i] = Math.ceil(Math.random()*2140)
		}
		fs.writeFileSync('categoryWiseDistribution.json', JSON.stringify(x))
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

	async step4(){
		const sampleSize = ([...arr], n = 1) => {
			let m = arr.length;
			
			// Shuffle the array using the Fisher-Yates algorithm
			while (m) {
			  const i = Math.floor(Math.random() * m--);
			  [arr[m], arr[i]] = [arr[i], arr[m]];
			}
			
			// Return a slice of the shuffled array with 'n' elements
			return arr.slice(0, n);
		};
		const attributes = fs.readFileSync('final2.json')
		const attributeDbNames = Object.keys(JSON.parse(attributes.toString()))
		const y = {}
		for(let categoryId in randomDistrib){
			if(categoryId==='1'){
				y['1'] = []
				continue
			}
			y[categoryId] = sampleSize(attributeDbNames, randomDistrib[categoryId])
		}
		fs.writeFileSync('categoryAttributeMapping.json', JSON.stringify(y))
	}

	async step5(){
		
	}

	async uploadToDb(){
		// const categoryAttributeMapping = JSON.parse((fs.readFileSync('categoryAttributeMapping.json').toString()))
		// for(let categoryId in categoryAttributeMapping){
		// 	this.categoryAttributeMappingRepository.save({
		// 		category_id:Number(categoryId),
		// 		attributes:categoryAttributeMapping[categoryId]
		// 	})
		// }
		const attributeValue = JSON.parse((fs.readFileSync('final3.json').toString()))
		for(let attribute in attributeValue){
			this.attributeSetOfValuesRepository.save({
				attribute:attribute,
				values:attributeValue[attribute]
			})
		}
	}

	async generateNormalProducts(){
		const categoryAttributeMapping = await this.categoryAttributeMappingRepository.find()
		const products = 100000
		for(let i=0; i<products;i++){
			if(i%100===0)
				console.log(i)
			const categoryId = Math.ceil(Math.random()*300)
			let productData = {}
			const attributeDbNames = categoryAttributeMapping.find(x=>x.category_id ===categoryId).attributes
			for(let attributeDbName of attributeDbNames){
				const [{value}] = await this.dataSource.manager.query(`SELECT values[1 + floor((random() * array_length(values, 1)))::int] as value FROM attribute_set_of_values where attribute = $1`, [attributeDbName])
				productData[attributeDbName] = value
			}
			const productDataDb:ProductData = {
				pdm_id:undefined,
				category_id:categoryId,
				tenant_id:'IN0003',
				org_id:'OR0001',
				code:uuidv4(),
				product_name:`Dummy`,
				product_data:productData,
				variant_data:{},
				variant_dependent_data:{}
			}
			const x = (await this.productDataRepository.insert(productDataDb)).identifiers
			const pdmId = x[0].pdm_id
			const productMetadata:ProductMetadata = {
				pdm_id:pdmId, 
				// pdm_id:1,
				parent_pdm_id:null,
				category_id:categoryId,
				tenant_id:'IN0003',
				org_id:'OR0001',
				other_variant:[],
				status:true,
				classification:'Normal',
				completion_percentage:100
			}
			await this.productMetadataRepository.insert(productMetadata)
			await this.mongoService.createProduct(productDataDb, productMetadata)

		}

		
	}
	async getQuery(body){
		let data
		if(body.database==='m'){
			console.log(`called mongo`)
			data=await this.mongoService.getProduct()

		}else if(body.database==='p'){
			console.log(`called postgres`)
			data = await this.dataSource.manager.query(`SELECT * FROM product_data
			WHERE (product_data ->> 'far_1469') = 'dd510216-7313-41f4-8460-cd1cd9aa488c'
			AND   (product_data ->> 'far_1469') IS NOT NULL;`)
		}
		console.log(data.length);
		return data
		// await this.dataSource.manager.query(`SELECT * from product_data where  (product_data->'far_1469') is "dd510216-7313-41f4-8460-cd1cd9aa488c"--"product_data" @> '{"far_1469": "dd510216-7313-41f4-8460-cd1cd9aa488c"}' and tenant_id = 'IN0003' and org_id='OR0001'`)
	}
}

// CREATE INDEX test_index ON product_data (((product_data ->> 'far_1469')))
// WHERE (product_data ->> 'far_1469') IS NOT NULL;

// SELECT * FROM product_data
// WHERE (product_data ->> 'far_1469') = 'dd510216-7313-41f4-8460-cd1cd9aa488c'
// AND   (product_data ->> 'far_1469') IS NOT NULL;

const randomDistrib = {
    "1": 0,
    "2": 291,
    "3": 686,
    "4": 1890,
    "5": 1528,
    "6": 210,
    "7": 1534,
    "8": 735,
    "9": 800,
    "10": 382,
    "11": 148,
    "12": 1526,
    "13": 1231,
    "14": 61,
    "15": 935,
    "16": 654,
    "17": 1515,
    "18": 1811,
    "19": 403,
    "20": 729,
    "21": 234,
    "22": 2105,
    "23": 2032,
    "24": 1002,
    "25": 1187,
    "26": 740,
    "27": 1343,
    "28": 1286,
    "29": 283,
    "30": 30,
    "31": 1936,
    "32": 1534,
    "33": 438,
    "34": 1018,
    "35": 1304,
    "36": 1267,
    "37": 115,
    "38": 2054,
    "39": 1765,
    "40": 1839,
    "41": 355,
    "42": 991,
    "43": 1297,
    "44": 2104,
    "45": 1701,
    "46": 982,
    "47": 1426,
    "48": 1106,
    "49": 1636,
    "50": 1159,
    "51": 281,
    "52": 1232,
    "53": 1653,
    "54": 1016,
    "55": 2055,
    "56": 375,
    "57": 1184,
    "58": 1217,
    "59": 1893,
    "60": 683,
    "61": 951,
    "62": 1599,
    "63": 950,
    "64": 1483,
    "65": 1753,
    "66": 1451,
    "67": 68,
    "68": 483,
    "69": 1038,
    "70": 1434,
    "71": 1092,
    "72": 1535,
    "73": 945,
    "74": 1034,
    "75": 605,
    "76": 1605,
    "77": 1657,
    "78": 1602,
    "79": 1774,
    "80": 692,
    "81": 1289,
    "82": 346,
    "83": 4,
    "84": 1144,
    "85": 966,
    "86": 1502,
    "87": 344,
    "88": 489,
    "89": 1357,
    "90": 518,
    "91": 821,
    "92": 1684,
    "93": 788,
    "94": 145,
    "95": 1398,
    "96": 1837,
    "97": 995,
    "98": 561,
    "99": 2119,
    "100": 681,
    "101": 131,
    "102": 2038,
    "103": 842,
    "104": 339,
    "105": 500,
    "106": 1358,
    "107": 118,
    "108": 530,
    "109": 857,
    "110": 2078,
    "111": 1479,
    "112": 1598,
    "113": 1690,
    "114": 1413,
    "115": 588,
    "116": 363,
    "117": 1778,
    "118": 1173,
    "119": 1983,
    "120": 36,
    "121": 306,
    "122": 793,
    "123": 2123,
    "124": 1459,
    "125": 407,
    "126": 880,
    "127": 1918,
    "128": 1138,
    "129": 395,
    "130": 1154,
    "131": 1764,
    "132": 250,
    "133": 1895,
    "134": 1060,
    "135": 1677,
    "136": 849,
    "137": 1908,
    "138": 735,
    "139": 519,
    "140": 244,
    "141": 1673,
    "142": 495,
    "143": 1221,
    "144": 417,
    "145": 118,
    "146": 947,
    "147": 1339,
    "148": 350,
    "149": 980,
    "150": 374,
    "151": 1667,
    "152": 756,
    "153": 1033,
    "154": 1574,
    "155": 1676,
    "156": 1316,
    "157": 575,
    "158": 980,
    "159": 646,
    "160": 324,
    "161": 999,
    "162": 113,
    "163": 615,
    "164": 705,
    "165": 1362,
    "166": 940,
    "167": 118,
    "168": 89,
    "169": 1064,
    "170": 640,
    "171": 1547,
    "172": 159,
    "173": 4,
    "174": 1355,
    "175": 942,
    "176": 40,
    "177": 2081,
    "178": 555,
    "179": 1674,
    "180": 1047,
    "181": 1748,
    "182": 2056,
    "183": 191,
    "184": 606,
    "185": 1852,
    "186": 270,
    "187": 1574,
    "188": 1390,
    "189": 787,
    "190": 954,
    "191": 262,
    "192": 1271,
    "193": 330,
    "194": 1646,
    "195": 1259,
    "196": 1615,
    "197": 2021,
    "198": 1494,
    "199": 1494,
    "200": 1569,
    "201": 1650,
    "202": 1694,
    "203": 264,
    "204": 291,
    "205": 531,
    "206": 1328,
    "207": 413,
    "208": 1499,
    "209": 757,
    "210": 563,
    "211": 1838,
    "212": 1140,
    "213": 559,
    "214": 923,
    "215": 443,
    "216": 55,
    "217": 240,
    "218": 120,
    "219": 1823,
    "220": 897,
    "221": 596,
    "222": 1916,
    "223": 1985,
    "224": 1300,
    "225": 1278,
    "226": 574,
    "227": 666,
    "228": 2118,
    "229": 1207,
    "230": 245,
    "231": 1745,
    "232": 558,
    "233": 958,
    "234": 1322,
    "235": 1034,
    "236": 133,
    "237": 1710,
    "238": 167,
    "239": 1829,
    "240": 1079,
    "241": 524,
    "242": 2013,
    "243": 1906,
    "244": 526,
    "245": 1198,
    "246": 2053,
    "247": 1413,
    "248": 485,
    "249": 647,
    "250": 536,
    "251": 2124,
    "252": 157,
    "253": 1723,
    "254": 1419,
    "255": 137,
    "256": 631,
    "257": 875,
    "258": 1034,
    "259": 59,
    "260": 960,
    "261": 1109,
    "262": 935,
    "263": 1787,
    "264": 122,
    "265": 1417,
    "266": 1900,
    "267": 814,
    "268": 990,
    "269": 367,
    "270": 927,
    "271": 1259,
    "272": 1969,
    "273": 448,
    "274": 2011,
    "275": 1254,
    "276": 2083,
    "277": 771,
    "278": 1380,
    "279": 557,
    "280": 569,
    "281": 1622,
    "282": 1519,
    "283": 76,
    "284": 397,
    "285": 905,
    "286": 1017,
    "287": 2013,
    "288": 1565,
    "289": 1760,
    "290": 1320,
    "291": 1065,
    "292": 1221,
    "293": 915,
    "294": 870,
    "295": 736,
    "296": 766,
    "297": 1327,
    "298": 1545,
    "299": 361,
    "300": 375
}
