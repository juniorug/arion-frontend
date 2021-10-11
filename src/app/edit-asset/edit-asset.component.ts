import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asset } from 'app/models/asset';
import { AssetService } from 'app/services/asset.service';
import { NotificationService } from 'app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
        this.handleError(error, 'Get Asset failed. Please try again.');
      }
    );
  }

  onSubmit() {
    this.spinner.show();
    console.log("Submitted! Updated asset: ", this.asset);
    this.assetService.updateAsset(this.assetId, this.asset).subscribe(
      data => {
        console.log(data);
        this.asset = new Asset();
        this.notificationServiceService.showNotification('success', 'Asset succesfully edited');
        this.gotoAssetList();
      }, 
      error =>  {
        this.handleError(error, 'Update Asset failed. Please try again.');
      }
    );
  }

  handleError(error: any, message: string) {
    console.log(error);
    this.notificationServiceService.showNotification('danger', message);
    this.spinner.hide();
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
