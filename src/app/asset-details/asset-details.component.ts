import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { AssetItemService } from 'app/services/asset-item.service';
import { AssetService } from 'app/services/asset.service';
import { NotificationService } from 'app/services/notification.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit {
  
  modalRef: BsModalRef;
  message: string;
  id: number;
  asset: Asset;
  selectedAssetItem: AssetItem;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetService: AssetService,
    private assetItemService: AssetItemService,
    private modalService: BsModalService,
    private notificationServiceService: NotificationService,
  ) { }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.asset = new Asset();
    this.id = this.route.snapshot.params['id'];
    this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    this.asset =  assetsJson['default'].find(asset => asset.assetID === this.id);
    console.log("asset: ", this.asset);
  }

  openModal(template: TemplateRef<any>, assetItem: any) {
    console.log("open modal called with assetItem: ", assetItem.assetItemID);
    this.selectedAssetItem = assetItem
    this.modalRef = this.modalService.show(template, {class: 'modal-confirm'});
  }
 
  confirm(): void {
    this.message = 'Confirmed!';
    this.assetItemService.deleteAssetItem(this.selectedAssetItem.assetItemID)
        .subscribe(
          data => {
            console.log(data);
            this.reloadData();
            this.notificationServiceService.showNotification('success', 'Asset Item succesfully deleted')
          },
          error => {
            console.log(error)
            this.notificationServiceService.showNotification('danger', 'Delete Asset Item failed. Please try again.')
          }
        );
    this.modalRef.hide();
    this.selectedAssetItem = new AssetItem();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
    this.selectedAssetItem = new AssetItem();
  }

  createAssetItem() {
    this.router.navigate(['create-asset-item']);
  }

  assetItemDetails(id: number){
    this.router.navigate(['asset-item-details', id]);
  }

  editAssetItem(id: number){
    this.router.navigate(['edit-asset-item', id]);
  }

  moveAssetItem(id: number){
    this.router.navigate(['move-asset-item', id]);
  }

  trackAssetItem(id: number){
    this.router.navigate(['track-asset-item', id]);
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
