import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { timeStamp } from "console"
import mongoose from "mongoose"

@Schema()
export class product_metadata{

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'product_data'})
    pdm_id:any
    
    @Prop({required:true})
    tenant_id : string
    
    @Prop({required:true})
    org_id:string

    @Prop({required:true})
    category_id:number

    @Prop({required:true})
    other_variant:number[]

    @Prop({required:true})
    status:boolean

    @Prop({required:true})
    classification:string

    @Prop({required:true})
    completion_percentage:number

    @Prop({default:0})
    variant_count:number   
    
    @Prop({default:true})
    variant_published:boolean

    @Prop({default:null})
    variant_deleted: boolean

    @Prop({timeStamp:true})
    created_at: Date

    @Prop()
    updated_at:Date
    
}
export const Product_Metadata = SchemaFactory.createForClass(product_metadata);
