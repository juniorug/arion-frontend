import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { Step } from 'app/models/step';
import { AssetItemService } from 'app/services/asset-item.service';
import { NotificationService } from 'app/services/notification.service';
import * as assetsJson from "../../assets/mock/assets.json";
import { AssetService } from '@app/services/asset.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-asset-item',
  templateUrl: './create-asset-item.component.html',
  styleUrls: ['./create-asset-item.component.scss']
})
export class CreateAssetItemComponent implements OnInit {
  
  asset: Asset;
  assetId: string;
  assetItem: AssetItem = new AssetItem();
  allowedActors: Actor[];
  assetItemFormGroup: FormGroup;
  aditionalInfoMapFormGroup: FormGroup;
  aditionalInfoMap: FormArray;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetItemService: AssetItemService,
    private notificationServiceService: NotificationService,
    private _formBuilder: FormBuilder, 
    private _ref: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private assetService: AssetService
  ) { 
    this.assetItemFormGroup = this._formBuilder.group({
      assetItemID: [''],
      parentID: new FormControl({ value: '0', disabled: true }),
      actorID: [''],
      stepID: new FormControl({ value: '1', disabled: true }),
      deliveryDate: [''],
      processDate: new FormControl({ value: new Date().toLocaleString(), disabled: true }),
      orderPrice: [''],
      shippingPrice: [''],
      status: [''],
      quantity: ['']
    });
    this.aditionalInfoMapFormGroup = this._formBuilder.group({
      aditionalInfoMap: this._formBuilder.array([  ]) //this.createAditionalInfoForm() 
    });
  }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });
    this.asset = new Asset();
    this.assetId = this.route.snapshot.params['assetId'];
    console.log("EditAssetItemComponent called with assetId= ", this.assetId);
    this.prepareData();
    
  }

  createAditionalInfoForm(): FormGroup {
    return this._formBuilder.group({
      key: [''],
      value: ['']
    });
  }

  addAditionalInfo(): void {
    console.log("addAditionalInfo called")
    this.aditionalInfoMap = this.aditionalInfoMapFormGroup.get('aditionalInfoMap') as FormArray;
    this.aditionalInfoMap.push(this.createAditionalInfoForm());
    this._ref.detectChanges();
  }

  removeAditionalInfo(id): void {
    console.log("removeAditionalInfo called with id: ", id);
    this.aditionalInfoMap = this.aditionalInfoMapFormGroup.get('aditionalInfoMap') as FormArray;
    this.aditionalInfoMap.removeAt(id);
    this._ref.detectChanges();
  }

  resetForm() {
    this.aditionalInfoMap.clear();
    this.assetItemFormGroup.reset();
    this.assetItemFormGroup.markAsPristine();
    this.assetItemFormGroup.markAsUntouched();
    this.resetFormGroup(this.assetItemFormGroup);
    this.resetFormGroup(this.aditionalInfoMapFormGroup);
    this.addAditionalInfo();
  }

  resetFormGroup(form: FormGroup ) {
    form.reset(form.value);
    form.markAsPristine();
    form.markAsUntouched();
  }

  prepareData() {
    this.spinner.show();
    this.assetService.getAsset(this.assetId).subscribe(
      data => {
        this.asset = data['data'];
        console.log("asset: ", this.asset);
        let firstStep: Step = this.asset.steps.find(step => step.stepOrder === 1);
        this.allowedActors = this.asset.actors.filter( actor => actor.actorType ===  firstStep.actorType);
        console.log("allowedActors= ", this.allowedActors);
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.notificationServiceService.showNotification('danger', 'get Asset failed. Please try again.');
        this.spinner.hide();
      }
    );
    this.assetItemFormGroup.setValue({
      assetItemID: [''],
      parentID: "0",
      actorID: [''],
      stepID: "1",
      deliveryDate: [''],
      processDate:  new Date().toLocaleString(),
      orderPrice: [''],
      shippingPrice: [''],
      status: [''],
      quantity: ['']
    });
  }

  onSelectActor(event: MatSelectChange): void {
    console.log("event.value: ", event.value); // get selected value

  }
  

  createAssetItem() {
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
    console.log("assetItemFormGroup", this.assetItemFormGroup.getRawValue());
    console.log("aditionalInfoMapFormGroup", this.aditionalInfoMapFormGroup.value);
    this.transformFormsToAssetItem();
    console.log("assetItem sent: ", this.assetItem);
    this.notificationServiceService.showNotification('success', 'Asset Item succesfully created');
    history.back();
  }

  transformFormsToAssetItem() {
    let assetItemFormRawValue = this.assetItemFormGroup.getRawValue();
    let aditionalInfoFormRawValue = this.aditionalInfoMapFormGroup.value.aditionalInfoMap;
    console.log("aditionalInfoFormRawValue: ", aditionalInfoFormRawValue);
    
    this.assetItem.assetItemID = assetItemFormRawValue.assetItemID;
    this.assetItem.stepID = "1";
    this.assetItem.ownerID = assetItemFormRawValue.actorID;
    this.assetItem.parentID = "0";
    this.assetItem.children = [];
    this.assetItem.processDate = assetItemFormRawValue.processDate;
    this.assetItem.deliveryDate = assetItemFormRawValue.deliveryDate;
    this.assetItem.orderPrice = assetItemFormRawValue.orderPrice;
    this.assetItem.shippingPrice = assetItemFormRawValue.shippingPrice;
    this.assetItem.status = assetItemFormRawValue.status;
    this.assetItem.quantity = assetItemFormRawValue.quantity;
    this.assetItem.deleted = false;
    this.assetItem.aditionalInfoMap = new Map();
    aditionalInfoFormRawValue.forEach(element => {
      console.log("aditionalInfoFormRawValue.foreach. [Key: ", element.key, "][value: ", element.value, "]");
      if (element.key && element.value) {
        console.log("inside if key/value");
        this.assetItem.aditionalInfoMap.set(element.key, element.value);
      }
    });
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
