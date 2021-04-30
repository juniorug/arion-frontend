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
  /** selectedkey to be used in the spector*/
  public selectedAssetItem: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetItemService: AssetItemService
  ) { }

  ngOnInit(): void {
    this.selectedNode = null;
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
    console.log("this.model: ", this.model);
    
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    this.asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
    this.trackedItems = new Array();
    //get the tree of children of given assetItem including itself
    this.getTree(this.assetItem).forEach(child => {
      this.trackedItems.push(child);
    });
    //get ancestrals of the  given assetItem
    let parent: AssetItem = this.assetItem; 
    while (parent.parentID !== '0') {
      parent = this.asset.assetItems.find(assetItem => assetItem.assetItemID === parent.parentID)
      this.trackedItems.push(parent);
    }
    //convert the tree data to the tree model used in the diagram
    this.convertTrackedItemsToTreeModel();
    this.selectedAssetItem = this.threeModel.find(model => model.key === this.assetItem.assetItemID);
  }

  getTree(assetItem: AssetItem) : AssetItem[] {
    let tree: AssetItem[] = new Array();
    if (!assetItem.children.length) {
      tree.push(assetItem);
    } else {
      assetItem.children.forEach(childId => {
        let childAssetItem = this.asset.assetItems.find(item => item.assetItemID === childId);
        let aux = this.getTree(childAssetItem);
        aux.forEach(child => {
          tree.push(child);
        });
      });
      tree.push(assetItem);
    }
    return tree;
  } 

  convertTrackedItemsToTreeModel() {
    this.threeModel = new Array();
    for (let item of this.trackedItems) {
      let currentStep = this.asset.steps.find(step => step.stepID === item.stepID);
      let currentActor = this.asset.actors.find( actor => actor.actorID === item.ownerID);
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
    //console.log("this.threeModel: ", this.threeModel);
  }

  public setSelectedNode(node) {
    if ( node) {
      this.selectedAssetItem = this.threeModel.find(model => model.key === node['nb']['key']);
    } else {
      this.selectedAssetItem =  null;
    }
    /* let currentNode = this.asset.actors.find( actor => actor.actorID === item.ownerID); */
    this.selectedNode =  new AssetItem() ;
  }
  
  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
