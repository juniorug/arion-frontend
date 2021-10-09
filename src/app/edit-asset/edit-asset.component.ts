import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetService } from 'app/services/asset.service';
import { NotificationService } from 'app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private spinner: NgxSpinnerService,
    private assetService: AssetService,
    private notificationServiceService: NotificationService,
  ) { }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.asset = new Asset();
    this.assetId = this.route.snapshot.params['id'];
    console.log("EditAssetComponent called with assetId= ", this.assetId);
    this.reloadData();
  }

  reloadData() {
    this.spinner.show();
    this.assetService.getAsset(this.assetId).subscribe(
      data => {
        this.asset = data['data'];
        console.log("asset: ", this.asset);
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.notificationServiceService.showNotification('danger', 'get Asset failed. Please try again.');
        this.spinner.hide();
      }
    );
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
