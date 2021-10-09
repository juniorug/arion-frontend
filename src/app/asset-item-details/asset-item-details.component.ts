import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { Step } from 'app/models/step';
import { AssetItemService } from 'app/services/asset-item.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AssetService } from "../services/asset.service";
import * as assetsJson from "../../assets/mock/assets.json";
import { NotificationService } from '@app/services/notification.service';
@Component({
  selector: 'app-asset-item-details',
  templateUrl: './asset-item-details.component.html',
  styleUrls: ['./asset-item-details.component.scss']
})
export class AssetItemDetailsComponent implements OnInit {

  assetId: string;
  id: string;
  asset: Asset;
  assetItem: AssetItem;
  currentStep: Step;
  currentActor: Actor;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetItemService: AssetItemService,
    private spinner: NgxSpinnerService,
    private assetService: AssetService,
    private notificationServiceService: NotificationService,
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.asset = new Asset();
    this.assetItem = new AssetItem();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("AssetItemDetailsComponent called with assetId= ", this.assetId, " and id= ", this.id );
    this.reloadData();
  }

  reloadData() {
    
    this.spinner.show();
    this.assetService.getAsset(this.assetId).subscribe(
      data => {
        this.asset = data['data'];
        console.log("asset: ", this.asset);
        this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
        console.log("assetItem: ", this.assetItem);
        this.currentStep = this.asset.steps.find(step => step.stepID === this.assetItem.stepID);
        console.log("currentStep: ", this.currentStep);
        this.currentActor = this.asset.actors.find( actor => actor.actorID === this.assetItem.ownerID);
        console.log("currentActor: ", this.currentActor);
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.notificationServiceService.showNotification('danger', 'get Asset List failed. Please try again.');
        this.spinner.hide();
      }
    );
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
