import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from "rxjs";
import { AssetService } from "../services/asset.service";
import { Asset } from "../models/asset";
import { Router } from '@angular/router';
import * as assetsJson from "../../assets/mock/assets.json";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationService } from 'app/services/notification.service';

//declare var $: any;
@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {

  modalRef: BsModalRef;
  message: string;

  //assets: Observable<Asset[]>;
  assets: any[];
  selectedAsset: any;

  constructor(
    private assetService: AssetService,
    private modalService: BsModalService,
    private notificationServiceService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });
    this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    this.assets =  assetsJson['default'];
    console.log("assets: ", this.assets);
  }

  openModal(template: TemplateRef<any>, asset: any) {
    console.log("open modal called with assetID: ", asset.assetID);
    this.selectedAsset = asset
    this.modalRef = this.modalService.show(template, {class: 'modal-confirm'});
  }
 
  confirm(): void {
    this.message = 'Confirmed!';
    this.assetService.deleteAsset(this.selectedAsset.assetID)
        .subscribe(
          data => {
            console.log(data);
            this.reloadData();
            this.notificationServiceService.showNotification('success', 'Asset succesfully deleted')
          },
          error => {
            console.log(error)
            this.notificationServiceService.showNotification('danger', 'Delete asset failed. Please try again.')
          }
        );
    this.modalRef.hide();
    this.selectedAsset = "";
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
    this.selectedAsset = "";
  }

  createAsset() {
    this.router.navigate(['create-asset']);
  }

  assetDetails(id: string){
    this.router.navigate(['asset-details', id]);
  }

  editAsset(id: string){
    console.log(">>> editAssed clicked. ID: ", id);
    
    this.router.navigate(['edit-asset', id]);
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
