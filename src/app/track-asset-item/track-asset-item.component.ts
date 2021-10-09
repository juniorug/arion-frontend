import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { AssetItemService } from 'app/services/asset-item.service';
import { AssetService } from '@app/services/asset.service';
import { NotificationService } from '@app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as go from 'gojs';
import { DataService } from '@app/services/data.service';


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
    private assetItemService: AssetItemService,
    private spinner: NgxSpinnerService,
    private assetService: AssetService,
    private dataService: DataService,
    private notificationServiceService: NotificationService
  ) { }



  ngOnInit(): void {
    this.selectedNode = null;
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });
    this.asset = new Asset();
    this.assetItem = new AssetItem();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("TrackAssetItemComponent called with assetId=", this.assetId, " and id=", this.id);
    this.reloadData();
    this.model = new go.TreeModel(this.threeModel);
    console.log("this.model: ", this.model);
    
  }

  reloadData() {
    this.spinner.show();
    this.asset =  this.dataService.getSharedAsset();
    if (this.asset == null) {
      console.log("SharedAsset is null, will return back");
      this.errorNoSharedAssetInLocalStorage();
    }
    console.log("this.asset : ", this.asset);
    
    this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
    console.log("this.assetItem : ", this.assetItem);
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
    this.spinner.hide(); 
  }

  getTree(assetItem: AssetItem) : AssetItem[] {
    let tree: AssetItem[] = new Array();
    console.log("getTree assetItem : ", assetItem);
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
  }

  public setSelectedNode(node) {
    if ( node) {
      this.selectedAssetItem = this.threeModel.find(model => model.key === node['nb']['key']);
    } else {
      this.selectedAssetItem =  null;
    }
    this.selectedNode =  new AssetItem() ;
  }

  errorNoSharedAssetInLocalStorage() {
    this.notificationServiceService.showNotification('danger', 'Error loading track asset item. Please try again.')
    history.back();
  }
  
  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}