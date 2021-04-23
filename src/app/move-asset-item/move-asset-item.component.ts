import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { AssetItemService } from 'app/services/asset-item.service';
import { NotificationService } from 'app/services/notification.service';
import * as assetsJson from "../../assets/mock/assets.json";
import * as cloneDeep from 'lodash/cloneDeep';
import { Step } from 'app/models/step';
@Component({
  selector: 'app-move-asset-item',
  templateUrl: './move-asset-item.component.html',
  styleUrls: ['./move-asset-item.component.scss']
})
export class MoveAssetItemComponent implements OnInit {

  assetId: string;
  id: string;
  assetItem: AssetItem;
  newAssetItem: AssetItem;
  allowedSteps: Step[];
  currentStep: Step;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetItemService: AssetItemService,
    private notificationServiceService: NotificationService
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.assetItem = new AssetItem();
    this.newAssetItem = new AssetItem();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("EditAssetItemComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    
    /* this.assetItemService.getAssetItem(this.id)
      .subscribe(data => {
        console.log(data)
        this.assetItem = data;
      }, error => console.log(error)); */
    this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    let asset: Asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    console.log("asset: ", asset);
    this.assetItem =  asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
    console.log("assetItem: ", this.assetItem);
    let currentStepId = Number(this.assetItem.stepID);
    this.currentStep = asset.steps.find( step => step.stepOrder === currentStepId);
    this.allowedSteps =  asset.steps.filter( step => step.stepOrder === (currentStepId - 1) || step.stepOrder === (currentStepId + 1) );
    this.startNewAssetItem();
  }

  startNewAssetItem() {
    this.newAssetItem = cloneDeep(this.assetItem);
    this.newAssetItem.parentID = this.assetItem.assetItemID;
    this.newAssetItem.assetItemID = "";
    this.newAssetItem.processDate = new Date().toLocaleString();
  }

  onSubmit() {
    /* this.assetItemService.updateAssetItem(this.id, this.assetItem)
      .subscribe(data => {
        console.log(data);
        this.assetItem = new AssetItem();
        this.gotoList();
      }, error => console.log(error)); */
      this.notificationServiceService.showNotification('success', 'AssetItem succesfully moved');
      this.gotoAssetItemList();

  }

  gotoAssetItemList() {
    history.back();
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
