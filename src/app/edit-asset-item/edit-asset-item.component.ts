import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AditionalInfo } from '@app/models/aditional-info';
import { AssetService } from '@app/services/asset.service';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { Step } from 'app/models/step';
import { NotificationService } from 'app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-asset-item',
  templateUrl: './edit-asset-item.component.html',
  styleUrls: ['./edit-asset-item.component.scss']
})
export class EditAssetItemComponent implements OnInit {
  
  assetId: string;
  id: string;
  asset: Asset;
  assetItem: AssetItem;
  selectedItemIndex: number
  currentStep: Step;
  currentActor: Actor;
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
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("EditAssetItemComponent called with assetId= ", this.assetId, " and id= ", this.id);
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
    console.log(">>>>>>> key: ", key, " value: ", value)
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
        this.currentStep = this.asset.steps.find( step => step.stepID === this.assetItem.stepID);
        console.log("currentStep: ", this.currentStep);
        this.currentActor = this.asset.actors.find( actor => actor.actorID === this.assetItem.ownerID);
        console.log("currentActor: ", this.currentActor);
        Object.keys(this.assetItem.aditionalInfoMap).forEach(index => {
          let item = this.assetItem.aditionalInfoMap[index];
          this.addAditionalInfoWithKeyValue(item.key, item.value);
        });
        this.spinner.hide();
      },
      error => {
        this.handleError(error, 'Get Asset failed. Please try again.');
      }
    );
  }

  onSubmit() {
    this.spinner.show();
    console.log("aditionalInfoMapFormGroup", this.aditionalInfoMapFormGroup.value);
    this.transformFormsToAssetItem();
    console.log("SUBMITED. assetItem: ", this.assetItem);
    this.asset.assetItems[this.selectedItemIndex] = this.assetItem;

    this.assetService.updateAsset(this.assetId, this.asset).subscribe(
      data => {
        console.log(data);
        this.asset = new Asset();
        this.notificationServiceService.showNotification('success', 'AssetItem succesfully edited');
        this.gotoAssetItemList();
      }, 
      error =>  {
        this.handleError(error, 'Update Actor failed. Please try again.');
      }
    );
  }

  transformFormsToAssetItem() {
    let aditionalInfoFormRawValue = this.aditionalInfoMapFormGroup.value.aditionalInfoMap;
    this.assetItem.aditionalInfoMap = [];
    aditionalInfoFormRawValue.forEach(element => {
      if (element.key && element.value) {
        let aditionalInfo = new AditionalInfo();
        aditionalInfo.key = element.key;
        aditionalInfo.value = element.value;
        console.log("inside if key/value");
        this.assetItem.aditionalInfoMap.push(aditionalInfo);
      }
    });
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
