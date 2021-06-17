import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { Step } from 'app/models/step';
import { AssetItemService } from 'app/services/asset-item.service';
import { NotificationService } from 'app/services/notification.service';
import * as cloneDeep from 'lodash/cloneDeep';
import * as moment from 'moment';
import * as assetsJson from "../../assets/mock/assets.json";
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
  aditionalInfoMapFormGroup: FormGroup;
  aditionalInfoMap: FormArray;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetItemService: AssetItemService,
    private notificationServiceService: NotificationService,
    private _formBuilder: FormBuilder, 
    private _ref: ChangeDetectorRef
  ) { 
    this.aditionalInfoMapFormGroup = this._formBuilder.group({
      aditionalInfoMap: this._formBuilder.array([  ]) //this.createAditionalInfoForm() 
    });
  }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.assetItem = new AssetItem();
    this.newAssetItem = new AssetItem();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("MoveAssetItemComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    
    /* this.assetItemService.getAssetItem(this.id)
      .subscribe(data => {
        console.log(data)
        this.assetItem = data;
      }, error => console.log(error)); */
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
    //this.assets = this.assetService.getAssetList();
    this.asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    console.log("asset: ", this.asset);
    this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
    console.log("assetItem: ", this.assetItem);
    //let currentStepId = Number(this.assetItem.stepID);
    this.currentStep =   this.asset.steps.find( step => step.stepID === this.assetItem.stepID);
    this.allowedSteps =  this.asset.steps.filter( step => step.stepOrder === (this.currentStep.stepOrder - 1) || step.stepOrder === (this.currentStep.stepOrder + 1) );
    this.currentActor =  this.asset.actors.find(actor => actor.actorID ===  this.assetItem.ownerID);
    
    Object.keys(this.assetItem.aditionalInfoMap).forEach(key => {
      let value = this.assetItem.aditionalInfoMap[key];
      this.addAditionalInfoWithKeyValue(key, value)
    });
    
    this.startNewAssetItem();

  }

  getCurrentStepOrder(assetItem) {
    
  }

  startNewAssetItem() {
    //this.newAssetItem = cloneDeep(this.assetItem);
    this.newAssetItem.parentID = this.assetItem.assetItemID;
    this.newAssetItem.stepID = this.assetItem.stepID;
    this.newAssetItem.assetItemID = "";
    this.newAssetItem.processDate = moment().format('YYYY-MM-DDTHH:mm:ss') ;
    //this.newAssetItem.processDate = new Date().toLocaleString();
  }

  onSubmit() {
    /* this.assetItemService.updateAssetItem(this.id, this.assetItem)
      .subscribe(data => {
        console.log(data);
        this.assetItem = new AssetItem();
        this.gotoList();
      }, error => console.log(error)); */
      console.log("aditionalInfoMapFormGroup", this.aditionalInfoMapFormGroup.value);
      this.transformFormsToAssetItem();
      console.log("SUBMITED. assetItem: ", this.newAssetItem);
      this.notificationServiceService.showNotification('success', 'AssetItem succesfully moved');
      this.gotoAssetItemList();

  }

  transformFormsToAssetItem() {
    let aditionalInfoFormRawValue = this.aditionalInfoMapFormGroup.value.aditionalInfoMap;
    this.newAssetItem.aditionalInfoMap = new Map();
    aditionalInfoFormRawValue.forEach(element => {
      if (element.key && element.value) {
        console.log("inside if key/value");
        this.newAssetItem.aditionalInfoMap.set(element.key, element.value);
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
