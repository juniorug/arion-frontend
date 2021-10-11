import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { AditionalInfo } from '@app/models/aditional-info';
import { AssetService } from '@app/services/asset.service';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { Step } from 'app/models/step';
import { NotificationService } from 'app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { v4 as uuidv4 } from 'uuid';
import * as cloneDeep from 'lodash/cloneDeep';
import * as moment from 'moment';
@Component({
  selector: 'app-move-asset-item',
  templateUrl: './move-asset-item.component.html',
  styleUrls: ['./move-asset-item.component.scss']
})
export class MoveAssetItemComponent implements OnInit {

  assetId: string;
  id: string;
  asset: Asset;
  assetItem: AssetItem;
  newAssetItem: AssetItem;
  currentStep: Step;
  allowedSteps: Step[];
  allowedActors: Actor[];
  currentActor: Actor;
  selectedItemIndex: number
  aditionalInfoMapFormGroup: FormGroup;
  aditionalInfoMap: FormArray;

  constructor(
    private route: ActivatedRoute,
    private notificationServiceService: NotificationService,
    private _formBuilder: FormBuilder, 
    private _ref: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private assetService: AssetService
  ) { 
    this.aditionalInfoMapFormGroup = this._formBuilder.group({
      aditionalInfoMap: this._formBuilder.array([  ]) //this.createAditionalInfoForm() 
    });
  }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });
    this.asset = new Asset();
    this.assetItem = new AssetItem();
    this.newAssetItem = new AssetItem();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("MoveAssetItemComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    this.reloadData();
  }

  createAditionalInfoForm(): FormGroup {
    return this._formBuilder.group({
      key: [''],
      value: ['']
    });
  }

  

  addAditionalInfo(): void {
    this.aditionalInfoMap = this.aditionalInfoMapFormGroup.get('aditionalInfoMap') as FormArray;
    this.aditionalInfoMap.push(this.createAditionalInfoForm());
    this._ref.detectChanges();
  }

  createAditionalInfoFormWithKeyValue(key: string, value: string): FormGroup {
    return this._formBuilder.group({
      key: [key],
      value: [value]
    });
  }

  addAditionalInfoWithKeyValue(key: string, value: string): void {
    this.aditionalInfoMap = this.aditionalInfoMapFormGroup.get('aditionalInfoMap') as FormArray;
    this.aditionalInfoMap.push(this.createAditionalInfoFormWithKeyValue(key, value));
    this._ref.detectChanges();
  }

  removeAditionalInfo(id): void {
    this.aditionalInfoMap = this.aditionalInfoMapFormGroup.get('aditionalInfoMap') as FormArray;
    this.aditionalInfoMap.removeAt(id);
    this._ref.detectChanges();
  }

  resetForm() {
    this.aditionalInfoMap.clear();
    this.resetFormGroup(this.aditionalInfoMapFormGroup);
    this.addAditionalInfo();
  }

  resetFormGroup(form: FormGroup ) {
    form.reset(form.value);
    form.markAsPristine();
    form.markAsUntouched();
  }

  reloadData() {
    this.spinner.show();
    this.assetService.getAsset(this.assetId).subscribe(
      data => {
        this.asset = data['data'];
        console.log("asset: ", this.asset);
        this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
        this.selectedItemIndex = this.asset.assetItems.findIndex(assetItem => assetItem.assetItemID === this.id);
        console.log("assetItem: ", this.assetItem);
        this.currentStep =   this.asset.steps.find( step => step.stepID === this.assetItem.stepID);
        this.allowedSteps =  this.asset.steps.filter( step => step.stepOrder === (this.currentStep.stepOrder - 1) || step.stepOrder === (this.currentStep.stepOrder + 1) );
        this.currentActor =  this.asset.actors.find(actor => actor.actorID ===  this.assetItem.ownerID);
        
        Object.keys(this.assetItem.aditionalInfoMap).forEach(index => {
          let item = this.assetItem.aditionalInfoMap[index];
          this.addAditionalInfoWithKeyValue(item.key, item.value);
        });
        this.startNewAssetItem();
        this.spinner.hide();
      },
      error => {
        this.handleError(error, 'Get Asset Item failed. Please try again.');
      }
    );
  }

  startNewAssetItem() {
    this.newAssetItem.parentID = this.assetItem.assetItemID;
    this.newAssetItem.stepID = this.assetItem.stepID;
    this.newAssetItem.assetItemID = "";
    this.newAssetItem.processDate = moment().format('YYYY-MM-DDTHH:mm:ss') ;
    this.newAssetItem.children = [];
    this.assetItem.deleted = false;
  }

  onSubmit() {
    this.spinner.show();
    console.log("aditionalInfoMapFormGroup", this.aditionalInfoMapFormGroup.value);
    this.transformFormsToAssetItem();
    this.newAssetItem.assetItemID = (this.newAssetItem.assetItemID)? this.newAssetItem.assetItemID : uuidv4();
    this.asset.assetItems.push(this.newAssetItem);
    this.assetItem.children.push(this.newAssetItem.assetItemID);
    this.asset.assetItems[this.selectedItemIndex] = this.assetItem;
    console.log("SUBMITED. currentAssetItem: ", this.assetItem);
    console.log("SUBMITED. assetItem: ", this.newAssetItem);
    this.assetService.updateAsset(this.assetId, this.asset).subscribe(
      data => {
        console.log(data);
        this.asset = new Asset();
        this.notificationServiceService.showNotification('success', 'AssetItem succesfully moved');
        this.spinner.hide();
        this.gotoAssetItemList();
      }, 
      error =>  {
        this.handleError(error, 'Update Actor failed. Please try again.');
      }
    );

  }

  transformFormsToAssetItem() {
    let aditionalInfoFormRawValue = this.aditionalInfoMapFormGroup.value.aditionalInfoMap;
    this.newAssetItem.aditionalInfoMap = [];
    aditionalInfoFormRawValue.forEach(element => {
      if (element.key && element.value) {
        let aditionalInfo = new AditionalInfo();
        aditionalInfo.key = element.key;
        aditionalInfo.value = element.value;
        console.log("inside if key/value");
        this.newAssetItem.aditionalInfoMap.push(aditionalInfo);
      }
    });
  }

  getStepSelected(event: MatSelectChange): void {
    console.log("event.value: ", event.value); // get selected value
    //console.log("event.source: ", event.source); // get all source options
    console.log("event.value.stepID: ", event.value.stepID);
    let selectedStep: Step =  this.asset.steps.find(step => step.stepOrder === event.value.stepOrder);
    console.log("selectedStep= ", selectedStep);
    this.allowedActors =  this.asset.actors.filter( actor => actor.actorType ===  selectedStep.actorType);
    console.log("allowedActors= ", this.allowedActors);
    this.newAssetItem.stepID = selectedStep.stepID;
  }
  getOwnerSelected(event: MatSelectChange): void {
    console.log("event.value: ", event.value); // get selected value
    console.log("event.value.actorID: ", event.value.actorID);
    this.newAssetItem.ownerID = event.value.actorID;
  }

  handleError(error: any, message: string) {
    console.log(error);
    this.notificationServiceService.showNotification('danger', message);
    this.spinner.hide();
  }

  gotoAssetItemList() {
    history.back();
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
