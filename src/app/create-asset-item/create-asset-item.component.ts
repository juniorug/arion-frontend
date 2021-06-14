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

@Component({
  selector: 'app-create-asset-item',
  templateUrl: './create-asset-item.component.html',
  styleUrls: ['./create-asset-item.component.scss']
})
export class CreateAssetItemComponent implements OnInit {
  
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
    this.assetId = this.route.snapshot.params['assetId'];
    console.log("EditAssetItemComponent called with assetId= ", this.assetId);
    let asset: Asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    let firstStep: Step =  asset.steps.find(step => step.stepOrder === 1);
    this.allowedActors =  asset.actors.filter( actor => actor.actorType ===  firstStep.actorType);
    console.log("allowedActors= ", this.allowedActors);
    /* this.assetItem = new AssetItem();
    this.assetItem.parentID = "0";
    this.assetItem.stepID = "1";
    this.assetItem.processDate = new Date().toLocaleString(); */
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
    this.notificationServiceService.showNotification('success', 'Asset Item succesfully created');
    //history.back();
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
