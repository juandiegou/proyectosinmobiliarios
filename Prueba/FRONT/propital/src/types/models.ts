export interface TimeStamps {
    createdAt: string;
    updatedAt: string;
}

export interface Location{
    lat_lon: number[]
}

export interface Property extends Location{

    id: number,
    address: string,
    price: number,
    bedrooms: number,
    bathrooms: number,
    size_sqft: number,
    location: number[] | Location ,
    terrain_type: string,
    is_offer: boolean,
    discount: number,
    description: string,
    details: any,
    latitude: number,
    longitude: number,
}

export interface BasePerson extends TimeStamps {
    name: string,
    documentType: string,
    document: string,
}
export interface User extends BasePerson{

}

export interface Admin extends BasePerson {
    user: User,
}


interface Query_type{
    'id'?:number,
    'address'?:string, 
    'max_price'?:number,
    'min_price'?:number
    'max_bedrooms'?:number,
    'min_bedrooms'?:number
    'max_bathrooms'?:number,
    'min_bathrooms'?:number,
    'min_size_sqft'?:number,
    'max_size_sqft'?:number,
    'location'?:number[],
    'terrain_type'?:string,
    'is_offer'?:boolean,
    'min_discount'?:number,
    'max_discount'?:number,
    'description'?:string,
    'details'?:string,
    'created_at'?:any,
    'updated_at'?: any
  }