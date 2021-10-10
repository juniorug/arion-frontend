import { AditionalInfo } from "./aditional-info";

export class AssetItem {
   assetItemID: string;
   stepID: string;
   ownerID: string;
   parentID: string;
   children: string[];
   processDate: string;
   deliveryDate: string;
   orderPrice: number;
   shippingPrice: string;
   status: number;
   quantity: string;
   deleted: boolean;
   aditionalInfoMap: AditionalInfo[];

   constructor(){
      this.aditionalInfoMap = [];
   }
}
