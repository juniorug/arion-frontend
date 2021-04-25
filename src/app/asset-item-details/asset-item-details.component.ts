import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { Step } from 'app/models/step';
import { AssetItemService } from 'app/services/asset-item.service';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-asset-item-details',
  templateUrl: './asset-item-details.component.html',
  styleUrls: ['./asset-item-details.component.scss']
})
export class AssetItemDetailsComponent implements OnInit {

  assetId: string;
  id: string;
  assetItem: AssetItem;
  currentStep: Step;
  currentActor: Actor;

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
    console.log("AssetItemDetailsComponent called with assetId= ", this.assetId, " and id= ", this.id );
    
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
    this.currentStep = asset.steps.find(step => step.stepID === this.assetItem.stepID);
    console.log("currentStep: ", this.currentStep);
    this.currentActor = asset.actors.find( actor => actor.actorID === this.assetItem.ownerID);
    console.log("currentActor: ", this.currentActor);
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
