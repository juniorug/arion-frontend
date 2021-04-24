export class AssetItem {
   assetItemID: string;
   stepID: string;
   ownerID: string;
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
