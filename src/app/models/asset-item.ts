export class AssetItem {
   assetItemID: string;
   ownerID: string;
   stepID: number;
   parentID: string;
   processDate: string;
   deliveryDate: string;
   orderPrice: number;
   shippingPrice: string;
   status: number;
   quantity: string;
   deleted: boolean;
   aditionalInfoMap: Map<string,string>;
}
