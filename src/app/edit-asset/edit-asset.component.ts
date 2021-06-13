import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetService } from 'app/services/asset.service';
import { NotificationService } from 'app/services/notification.service';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.scss']
})
export class EditAssetComponent implements OnInit {

  assetId: string;
  id: string;
  asset: Asset;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetService: AssetService,
    private notificationServiceService: NotificationService
  ) { }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.asset = new Asset();
    this.assetId = this.route.snapshot.params['id'];
    console.log("EditAssetComponent called with assetId= ", this.assetId);

    /* this.assetService.getasset(this.assetId)
      .subscribe(data => {
        console.log(data)
        this.asset = data;
      }, error => console.log(error)); */
      this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    this.asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    console.log("asset: ", this.asset);
  }

  onSubmit() {
    /* this.assetService.updateAsset(this.assetId, this.asset)
      .subscribe(data => {
        console.log(data);
        this.asset = new Asset();
        this.gotoList();
      }, error => console.log(error)); */
      this.notificationServiceService.showNotification('success', 'Asset succesfully edited');
      this.gotoAssetList();

  }

  gotoAssetList() {
    history.back();
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
