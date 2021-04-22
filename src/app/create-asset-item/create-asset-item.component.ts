import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { AssetItemService } from 'app/services/asset-item.service';
import { NotificationService } from 'app/services/notification.service';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-create-asset-item',
  templateUrl: './create-asset-item.component.html',
  styleUrls: ['./create-asset-item.component.scss']
})
export class CreateAssetItemComponent implements OnInit {
  
  assetId: string;
  assetItem: AssetItem = new AssetItem();

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

    this.assetId = this.route.snapshot.params['assetId'];
    console.log("EditAssetItemComponent called with assetId= ", this.assetId);
    this.assetItem.parentID = "0";
    this.assetItem.stepID = 1;
  }

  newAssetItem(): void {
    this.assetItem = new AssetItem();
  }

  onSubmit() {
    /* this.assetItemService.createAssetItem(this.assetItem).subscribe(
      data => {
        console.log(data)
        this.assetItem = new AssetItem();
        this.notificationServiceService.showNotification('success', 'AssetItem succesfully created');
        history.back();
      }, 
      error =>{
        console.log(error);
        this.notificationServiceService.showNotification('danger', 'Asset item not created. Please try again.')
      }
    ); */  
    this.notificationServiceService.showNotification('success', 'Asset Item succesfully created');
    history.back();
  }

  gotoAssetItemList() {
    history.back();
  }

}
