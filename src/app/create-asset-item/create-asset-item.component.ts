import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { Step } from 'app/models/step';
import { NotificationService } from 'app/services/notification.service';
import { AssetService } from '@app/services/asset.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AditionalInfo } from '@app/models/aditional-info';

@Component({
  selector: 'app-create-asset-item',
  templateUrl: './create-asset-item.component.html',
  styleUrls: ['./create-asset-item.component.scss']
})
export class CreateAssetItemComponent implements OnInit {
  
  asset: Asset;
  assetId: string;
  assetItem: AssetItem = new AssetItem();
  firstStep: Step;
  allowedActors: Actor[];
  assetItemFormGroup: FormGroup;
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
    this.assetItemFormGroup = this._formBuilder.group({
      assetItemID: '',
      parentID: new FormControl({ value: '0', disabled: true }),
      actorID: '',
      stepID: '',
      stepOrder: new FormControl({ value: '1', disabled: true }),
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
        this.firstStep = this.asset.steps.find(step => step.stepOrder === 1);
        this.allowedActors = this.asset.actors.filter( actor => actor.actorType ===  this.firstStep.actorType);
        console.log("allowedActors= ", this.allowedActors);
        this.spinner.hide();
      },
      error => {
        this.handleError(error, 'Get Asset Item failed. Please try again.');
      }
    );
    this.assetItemFormGroup.setValue({
      assetItemID: '',
      parentID: "0",
      actorID: [''],
      stepID: [''],
      stepOrder: "1",
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
    this.spinner.show();
    console.log("assetItemFormGroup", this.assetItemFormGroup.getRawValue());
    console.log("aditionalInfoMapFormGroup", this.aditionalInfoMapFormGroup.value);
    this.transformFormsToAssetItem();
    console.log("assetItem sent: ", this.assetItem);
    this.asset.assetItems.push(this.assetItem);
    console.log("Submitted! Updated asset: ", this.asset);
    this.assetService.updateAsset(this.assetId, this.asset).subscribe(
      data => {
        console.log(data);
        this.asset = new Asset();
        this.notificationServiceService.showNotification('success', 'Asset Item succesfully created');
        this.spinner.hide();
        this.gotoAssetItemList()

      }, 
      error =>  {
        this.handleError(error, 'Create Asset Item failed. Please try again.');
      }
    );
  }
  
  handleError(error: any, message: string) {
    console.log(error);
    this.notificationServiceService.showNotification('danger', message);
    this.spinner.hide();
  }

  transformFormsToAssetItem() {
    let assetItemFormRawValue = this.assetItemFormGroup.getRawValue();
    let aditionalInfoFormRawValue = this.aditionalInfoMapFormGroup.value.aditionalInfoMap;
    console.log("aditionalInfoFormRawValue: ", aditionalInfoFormRawValue);
    
    this.assetItem.assetItemID = assetItemFormRawValue.assetItemID;
    this.assetItem.stepID = this.firstStep.stepID;
    this.assetItem.ownerID = assetItemFormRawValue.actorID;
    this.assetItem.parentID = "0";
    this.assetItem.children = [];
    this.assetItem.processDate = this.formatDate(assetItemFormRawValue.processDate);
    this.assetItem.deliveryDate = assetItemFormRawValue.deliveryDate;
    this.assetItem.orderPrice = assetItemFormRawValue.orderPrice;
    this.assetItem.shippingPrice = assetItemFormRawValue.shippingPrice;
    this.assetItem.status = assetItemFormRawValue.status;
    this.assetItem.quantity = assetItemFormRawValue.quantity;
    this.assetItem.deleted = false;
    this.assetItem.aditionalInfoMap = [];
    aditionalInfoFormRawValue.forEach(element => {
      console.log("aditionalInfoFormRawValue.foreach. [Key: ", element.key, "][value: ", element.value, "]");
      if (element.key && element.value) {
        let aditionalInfo = new AditionalInfo();
        aditionalInfo.key = element.key;
        aditionalInfo.value = element.value;
        console.log("inside if key/value");
        this.assetItem.aditionalInfoMap.push(aditionalInfo);
      }
    });
  }


  formatDate(jDate: any) {
    const date: Date = new Date(jDate);
    let formatted = 
      date.getFullYear() + "-" + 
      this.addZero((date.getMonth()+1)) + "-" + 
      this.addZero(date.getDate()) + "T" + 
      this.addZero(date.getHours()) + ":" + 
      this.addZero(date.getMinutes()) + ":" + 
      this.addZero(date.getSeconds());
    console.log("formatted: ", formatted);
    return formatted
  }

  addZero(numero){
    if (numero <= 9) 
      return "0" + numero;
    else
      return numero; 
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
