import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { AssetItemService } from 'app/services/asset-item.service';
import * as assetsJson from "../../assets/mock/assets.json";
import * as go from 'gojs';


@Component({
  selector: 'app-track-asset-item',
  templateUrl: './track-asset-item.component.html',
  styleUrls: ['./track-asset-item.component.scss']
})
export class TrackAssetItemComponent implements OnInit {

  asset: Asset;
  assetId: string;
  id: string;
  assetItem: AssetItem;
  trackedItems: AssetItem[];
  threeModel: any[];

  /* GoJs diagram variables: public selectedNode = null;*/
  public selectedNode = null;
  public model: go.TreeModel;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetItemService: AssetItemService
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.assetItem = new AssetItem();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("TrackAssetItemComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    
    /* this.assetItemService.getAssetItem(this.id)
      .subscribe(data => {
        console.log(data)
        this.assetItem = data;
      }, error => console.log(error)); */
    this.reloadData();
    this.model = new go.TreeModel(this.threeModel);
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    this.asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    console.log("asset: ", this.asset);
    this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
    console.log("assetItem: ", this.assetItem);
    this.trackedItems = new Array();
    this.trackedItems.push(this.assetItem);
    while (this.assetItem.parentID !== '0') {
      this.assetItem = this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.assetItem.parentID)
      this.trackedItems.push(this.assetItem);
    }
    console.log("this.trackedItems: ", this.trackedItems);
    this.convertTrackedItemsToTreeModel();
  }

  convertTrackedItemsToTreeModel() {
    this.threeModel = new Array();
    for (let item of this.trackedItems) {
      console.log(item); // 1, "string", false

      let currentStep = this.asset.steps.find(step => step.stepID === item.stepID);
      console.log("currentStep: ", currentStep);
      let currentActor = this.asset.actors.find( actor => actor.actorID === item.ownerID);
      console.log("currentActor: ", currentActor);
      this.threeModel.push(
        {
          "key": item.assetItemID,
          "step": currentStep.stepName,
          "owner": currentActor.actorName,
          "parent": item.parentID,
          "processDate": item.processDate,
          "deliveryDate": item.deliveryDate,
          "orderPrice": item.orderPrice,
          "shippingPrice": item.shippingPrice,
          "status": item.status,
          "quantity": item.quantity,
          "aditionalInfoMap": item.aditionalInfoMap
        }
      );
    }
    console.log("this.threeModel: ", this.threeModel);
  }

  public setSelectedNode(node) {
    this.selectedNode = node;
  }
  
  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
