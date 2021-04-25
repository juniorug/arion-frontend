import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { Step } from 'app/models/step';
import { AssetItemService } from 'app/services/asset-item.service';
import { NotificationService } from 'app/services/notification.service';
import * as cloneDeep from 'lodash/cloneDeep';
import * as moment from 'moment';
import * as assetsJson from "../../assets/mock/assets.json";
@Component({
  selector: 'app-move-asset-item',
  templateUrl: './move-asset-item.component.html',
  styleUrls: ['./move-asset-item.component.scss']
})
export class MoveAssetItemComponent implements OnInit {

  assetId: string;
  id: string;
  asset: Asset;
  assetItem: AssetItem;
  newAssetItem: AssetItem;
  currentStep: Step;
  allowedSteps: Step[];
  allowedActors: Actor[];
  currentActor: Actor;

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
    this.asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    console.log("asset: ", this.asset);
    this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
    console.log("assetItem: ", this.assetItem);
    let currentStepId = Number(this.assetItem.stepID);
    this.currentStep = this.asset.steps.find( step => step.stepOrder === currentStepId);
    this.allowedSteps =  this.asset.steps.filter( step => step.stepOrder === (currentStepId - 1) || step.stepOrder === (currentStepId + 1) );
    this.currentActor =  this.asset.actors.find(actor => actor.actorType ===  this.currentStep.actorType);
    this.startNewAssetItem();
  }

  startNewAssetItem() {
    //this.newAssetItem = cloneDeep(this.assetItem);
    this.newAssetItem.parentID = this.assetItem.assetItemID;
    this.newAssetItem.stepID = this.assetItem.stepID;
    this.newAssetItem.assetItemID = "";
    this.newAssetItem.processDate = moment().format('YYYY-MM-DD HH:mm:ss') ;
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

  getStepSelected(event: MatSelectChange): void {
    console.log("event.value: ", event.value); // get selected value
    //console.log("event.source: ", event.source); // get all source options
    console.log("event.value.stepID: ", event.value.stepID);
    let selectedStep: Step =  this.asset.steps.find(step => step.stepOrder === event.value.stepOrder);
    console.log("selectedStep= ", selectedStep);
    this.allowedActors =  this.asset.actors.filter( actor => actor.actorType ===  selectedStep.actorType);
    console.log("allowedActors= ", this.allowedActors);
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
