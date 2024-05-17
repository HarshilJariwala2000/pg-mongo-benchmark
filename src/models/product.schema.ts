// import {} from 'mongoose'
import {Schema,Prop,SchemaFactory} from '@nestjs/mongoose'
import mongoose from 'mongoose'


@Schema()
export class product_data{

    @Prop({required:true})
    category_id:number
    
    @Prop({required:true})
    tenant_id : string
    
    @Prop({required:true})
    org_id:string

    @Prop({unique:true,nullable:true})
    code:string

    @Prop()
    product_name:string
    
    @Prop({required:true,type:Object})
    product_data:Object
    
    @Prop({required:true,type:Object})
    variant_data:Object

    @Prop({required:true,type:Object})
    variant_dependent_data:Object

}
export const Product_data = SchemaFactory.createForClass(product_data); 













