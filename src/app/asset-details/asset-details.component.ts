import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { ActorService } from 'app/services/actor.service';
import { AssetItemService } from 'app/services/asset-item.service';
import { AssetService } from 'app/services/asset.service';
import { NotificationService } from 'app/services/notification.service';
import { StepService } from 'app/services/step.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit {
  
  modalRef: BsModalRef;
  message: string;
  id: string;
  asset: Asset;
  selectedObjectID: string;
  selectedObjectType: string;
  showCreateAssetItemButton: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetService: AssetService,
    private actorService: ActorService,
    private stepService: StepService,
    private dataService: DataService,
    private assetItemService: AssetItemService,
    private modalService: BsModalService,
    private notificationServiceService: NotificationService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    //TODO: verificar chamada aos services!!!
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });
    this.showCreateAssetItemButton = true;
    this.asset = new Asset();
    this.id = this.route.snapshot.params['id'];
    this.reloadData();
    console.log("AssetDetailsComponent called with Id= ", this.id);
  }

  reloadData() {
    this.spinner.show();
    this.assetService.getAsset(this.id).subscribe(
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

  getOwnerName(assetItem) {
    let currentActor = this.asset.actors.find(actor => actor.actorID === assetItem.ownerID);
    return currentActor.actorName;
  }

  getCurrentStep(assetItem) {
    let currentStep = this.asset.steps.find( step => step.stepID === assetItem.stepID);
    return currentStep.stepName;
  }

  openModal(template: TemplateRef<any>, selectedObjectType: any, selectedObjectId: any) {
    console.log("open modal called with id: ", selectedObjectId);
    this.selectedObjectType = selectedObjectType;
    this.selectedObjectID = selectedObjectId;
    this.modalRef = this.modalService.show(template, {class: 'modal-confirm'});
  }
 
  confirm(): void {
    if (this.selectedObjectType === "Asset Item") {
      this.deleteAssetItem();
    } else if (this.selectedObjectType === "Actor") {
      this.deleteActor();
    } else if (this.selectedObjectType === "Step") {
      this.deleteStep();
    }
  }

  deleteAssetItem(): void {
    this.message = 'Confirmed!';
    this.assetItemService.deleteAssetItem(this.selectedObjectID)
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
    this.clearSelected();
  }
 
  deleteActor() {
    this.message = 'Confirmed!';
    this.actorService.deleteActor(this.selectedObjectID)
        .subscribe(
          data => {
            console.log(data);
            this.reloadData();
            this.notificationServiceService.showNotification('success', 'Actor succesfully deleted')
          },
          error => {
            console.log(error)
            this.notificationServiceService.showNotification('danger', 'Delete Actor. Please try again.')
          }
        );
    this.modalRef.hide();
    this.clearSelected();
  }

  deleteStep() {
    this.message = 'Confirmed!';
    this.stepService.deleteStep(this.selectedObjectID)
        .subscribe(
          data => {
            console.log(data);
            this.reloadData();
            this.notificationServiceService.showNotification('success', 'Step succesfully deleted')
          },
          error => {
            console.log(error)
            this.notificationServiceService.showNotification('danger', 'Delete Step. Please try again.')
          }
        );
    this.modalRef.hide();
    this.clearSelected();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
    this.clearSelected();
  }

  clearSelected(): void {
    this.selectedObjectID = "";
    this.selectedObjectType = "";
  }
  
  createAssetItem(assetId: number) {
    this.router.navigate(['create-asset-item', assetId,]);
  }

  assetItemDetails(assetId: number, id: number){
    console.log("will call asset-item-details with id: ", id);
    
    this.router.navigate(['asset-item-details', assetId, id]);
  }

  editAssetItem(assetId: number, id: number){
    this.router.navigate(['edit-asset-item', assetId, id]);
  }

  moveAssetItem(assetId: number, id: number){
    this.router.navigate(['move-asset-item', assetId, id]);
  }

  trackAssetItem(assetId: number, id: number){
    this.dataService.setSharedAsset(this.asset);
    this.router.navigate(['track-asset-item', assetId, id]);
  }

  actorDetails(assetId: number, id: number){
    this.router.navigate(['actor-details', assetId, id]);
  }

  editActor(assetId: number, id: number){
    this.router.navigate(['edit-actor', assetId, id]);
  }

  stepDetails(assetId: number, id: number){
    this.router.navigate(['step-details', assetId, id]);
  }

  editStep(assetId: number, id: number){
    this.router.navigate(['edit-step', assetId, id]);
  }

  mustShowCreateAssetItemButton() {
    this.showCreateAssetItemButton = true;
  }
  mustHideCreateAssetItemButton() {
    this.showCreateAssetItemButton = false;
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
