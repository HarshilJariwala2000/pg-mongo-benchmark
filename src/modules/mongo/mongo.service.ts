import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { product_data } from '../../models/product.schema';
import {Model} from 'mongoose'
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { product_metadata } from '../../models/product_metadata.schema';
import {productdatadto,productmetadatadto} from '../../entity'

@Injectable()
export class MongoService {
    constructor(
        @InjectModel(product_data.name)private productData:Model<product_data>,
        @InjectModel(product_metadata.name)private productMetadata:Model<product_metadata>
    ){}

    async createProduct(productdata: productdatadto, productmetadata: productmetadatadto) {
        let res = [], meta = [];
        let x = new this.productData();
        x.code = uuidv4()
        x.category_id = productdata.category_id
        x.org_id = productdata.org_id
        x.tenant_id = productdata.tenant_id
        x.product_name = productdata.product_name
        x.product_data = productdata.product_data
        x.variant_data = productdata.variant_data
        x.variant_dependent_data = productdata.variant_dependent_data
        res.push(x);
        let y = new product_metadata()
        y.pdm_id = x._id
        y.category_id = productmetadata.category_id
        y.org_id = productmetadata.org_id
        y.tenant_id = productmetadata.tenant_id
        y.other_variant = productmetadata.other_variant
        y.status = productmetadata.status
        y.classification = productmetadata.classification
        y.completion_percentage = productmetadata.completion_percentage
        y.variant_count = productmetadata.variant_count
        y.variant_published = productmetadata.variant_published
        y.variant_deleted = productmetadata.variant_deleted
        y.created_at = productmetadata.created_at
        y.updated_at = productmetadata.updated_at
        meta.push(y);
        await this.productData.insertMany(res);
        await this.productMetadata.insertMany(meta);
        return `data`;
    }
    async getProduct(){
        let data = await this.productData.find({
            "product_data.far_1469":"dd510216-7313-41f4-8460-cd1cd9aa488c"
        })
        // .populate({path:'pdm_id'})
        console.log(data.length);
        return data;
    }
    // async create() {
    //     let k = 0;
    //     while (k != 16) {
    //         for (let j = 1; j < 12; j++) {
    //             const data = await fs.readFileSync(`src/modules/sku/variant_data${j}.json`)
    //             console.log(`===========================${j}====================`)
    //             let prd = JSON.parse(data.toString())
    //             let res = [], meta = [];
    //             const start = Date.now();
    //             for (let i = 0; i < prd.length; i++) {
    //                 //for Product_Data table 
    //                 let x = new product_data();
    //                 x.pdm_id = uuidv4()
    //                 x.code = uuidv4()
    //                 x.category_id = prd[i].product_data.category_id
    //                 x.org_id = prd[i].product_data.org_id
    //                 x.tenant_id = prd[i].product_data.tenant_id
    //                 x.product_name = prd[i].product_data.product_name
    //                 x.product_data = prd[i].product_data.product_data
    //                 x.variant_data = prd[i].product_data.variant_data
    //                 x.variant_dependent_data = prd[i].product_data.variant_dependent_data
    //                 res.push(x);

    //                 //FOR PRODUCT_METADATA
    //                 let y = new product_metadata()
    //                 y.pdm_id = x.pdm_id;
    //                 y.category_id = prd[i].product_metadata.category_id
    //                 y.org_id = prd[i].product_metadata.org_id
    //                 y.tenant_id = prd[i].product_metadata.tenant_id
    //                 y.other_variant = prd[i].product_metadata.other_variant
    //                 y.status = prd[i].product_metadata.status
    //                 y.classification = prd[i].product_metadata.classification
    //                 y.completion_percentage = prd[i].product_metadata.completion_percentage
    //                 y.variant_count = prd[i].product_metadata.variant_count
    //                 y.variant_published = prd[i].product_metadata.variant_published
    //                 y.variant_deleted = prd[i].product_metadata.variant_deleted
    //                 y.created_at = prd[i].product_metadata.created_at
    //                 y.updated_at = prd[i].product_metadata.updated_at
    //                 // prd[i].product_data.pdm_id=uuidv4();
    //                 // prd[i].product_data.code=uuidv4();
    //                 // prd[i].product_metadata=prd[i].product_data.pdm_id
    //                 // res.push(prd[i].product_data);
    //                 meta.push(y);
    //             }

    //             await this.productData.insertMany(res);
    //             await this.productMetadata.insertMany(meta);
    //             const end = Date.now();
    //             console.log(prd.length, `================`, (end - start) / 1000);
    //         }
    //         k++;
    //     }
    //     // let data= await this.productData.find()
    //     // .populate({ path: 'product'})
    //     // .limit(1);
    //     return `Success`;
    // }
}
