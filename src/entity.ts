import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Unique } from 'typeorm';
export type Classification = "Normal" | "BOM" | "Variants" | "Style"

@Entity()
@Unique(['tenant_id', 'org_id', 'code'])
export class ProductData {
    @PrimaryGeneratedColumn()
    pdm_id: number;

    @PrimaryColumn()
    category_id: number;

    @PrimaryColumn()
    tenant_id: string;

    @PrimaryColumn({ default: true })
    org_id: string;

    @Column({nullable:true})
    code:string

    @Column({nullable:true})
    product_name:string

    @Column({type:'jsonb', default:{}})
    product_data:Object

    @Column({type:'jsonb', default:{}})
    variant_data:Object

    @Column({type:'jsonb', default:{}})
    variant_dependent_data:Object

}

@Entity()
export class ProductMetadata{
	@PrimaryColumn()
	pdm_id:number

    @Column({nullable:true})
    parent_pdm_id:number

	@PrimaryColumn()
	category_id:number

	@PrimaryColumn()
	tenant_id:string

	@PrimaryColumn()
	org_id:string

	@Column('int', {array:true, nullable:true})
	other_variant:number[]
	
	@Column({default:true})
	variant_published?:boolean

	@Column({default:true})
	status?:boolean

	@Column()
	classification:Classification

    @Column({nullable:true, default:0})
    completion_percentage?:number

    @Column({nullable:true, default:0})
    variant_count?:number

    @Column({default:false})
    variant_deleted?:boolean

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at?: Date

    @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at?: Date

}