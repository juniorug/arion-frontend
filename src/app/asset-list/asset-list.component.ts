import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from "rxjs";
import { AssetService } from "../services/asset.service";
import { Asset } from "../models/asset";
import { Router } from '@angular/router';
import * as assetsJson from "../../assets/mock/assets.json";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare var $: any;
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
    private router: Router
  ) { }

  ngOnInit(): void {
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
            this.showNotification('success', 'Asset succesfully deleted')
          },
          error => {
            console.log(error)
            this.showNotification('danger', error.message)
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
    this.router.navigate(['create']);
  }

  assetDetails(id: number){
    this.router.navigate(['details', id]);
  }

  editAsset(id: number){
    this.router.navigate(['update', id]);
  }

  showNotification(type, message) {


    $.notify({
        icon: "notifications",
        message: message

    },{
        type: type,
        timer: 400,
        placement: {
            from: 'top',
            align: 'right'
        },
        template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }

}
