import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Actor } from '@app/models/actor';
import { Asset } from '@app/models/asset';
import { AssetItem } from '@app/models/asset-item';
import { Step } from '@app/models/step';
import { AssetService } from '@app/services/asset.service';
import { DataService } from '@app/services/data.service';
import { NotificationService } from '@app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  assets: Asset[];
  assetId: string;
  records: any[];
  searchId: string;
  entitySelector: number;

  /**items to rearch */
  asset: Asset;
  actor: Actor;
  step: Step;
  assetItem: AssetItem;
  auditForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private assetService: AssetService,
    private dataService: DataService,
    private notificationServiceService: NotificationService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
      document.getElementsByClassName("audit")[0].classList.add("active");
    });
    this.auditForm = this.formBuilder.group({
      searchId: '',
    });
    this.asset = new Asset();
    this.assetId = "cb7497f0-47d7-435b-96e2-8d4258517b7a";
    this.searchId = "a544bb43-61c6-48e9-9908-3edc17837dc3";
    this.entitySelector = 1;
    console.log("previous asset id : ", this.assetId);
    //this.getAssetFromSearchId();
  }

  getAssetFromSearchId() {
    this.assetService.getAssetList().subscribe(
      data => {
        this.assets = data['data'];
        console.log("assets: ", this.assets);
        if (this.entitySelector == 2) {
          this.assetId = this.getAssetIdFromActor();
          this.asset = this.assets.find(asset => asset.assetID === this.assetId);
          this.actor = this.asset.actors.find(actor => actor.actorID === this.searchId);
        } else if (this.entitySelector == 3) {
          this.assetId = this.getAssetIdFromStep();
          this.asset = this.assets.find(asset => asset.assetID === this.assetId);
          this.step = this.asset.steps.find(step => step.stepID === this.searchId);
        } else if (this.entitySelector == 4) {
          this.assetId = this.getAssetIdFromAssetItem();
          this.asset =  this.assets.find(asset => asset.assetID === this.assetId);
          this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.searchId);
        }
        this.asset =  this.assets.find(asset => asset.assetID === this.assetId);
        this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.searchId);
        console.log("FOUND ASSET ID : ", this.assetId);
        console.log("FOUND assetItem : ", this.assetItem);
        console.log("FOUND ASSET : ", this.asset);
        console.log("will call searchaudit");
        this.searchAudit();
      },
      error => {
        this.handleError(error,'Get Audit info failed. Please try again.');
      }
    );
  }

  searchAudit() {
    let recordMap = new Map();
    console.log("searchaudit called with asset id : ", this.assetId);
    this.spinner.show();
    this.assetService.getAudit(this.assetId).subscribe(
      data => {
        this.records = data['data'].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        console.log("records: ", this.records);


        let recordWithSearchedList: any[];
        if (this.entitySelector == 2) {
          recordWithSearchedList = this.records.filter(recordItem =>
            recordItem.record.actors.some(actor => actor.actorID === this.searchId)
          );
          console.log("recordWithSearchedList: ", recordWithSearchedList);
          recordWithSearchedList.forEach( recordAux => {
            let actorAux = recordAux.record.actors.find(actor => actor.actorID === this.searchId);
            console.log("actorAux: ", actorAux);
            
            if (!recordMap.has(JSON.stringify(actorAux))) {
              console.log("NOT in map. will add actorAux: ", actorAux);
              recordMap.set(JSON.stringify(actorAux), recordAux);
            }
          });
        } else if (this.entitySelector == 3) {
          recordWithSearchedList = this.records.filter(recordItem =>
            recordItem.record.steps.some(step => step.stepID === this.searchId)
          );
          console.log("recordWithSearchedList: ", recordWithSearchedList);
          recordWithSearchedList.forEach( recordAux => {
            let stepAux = recordAux.record.steps.find(step => step.stepID === this.searchId);
            console.log("stepAux: ", stepAux);
            
            if (!recordMap.has(JSON.stringify(stepAux))) {
              console.log("NOT in map. will add stepAux: ", stepAux);
              recordMap.set(JSON.stringify(stepAux), recordAux);
            }
          });
        } else if (this.entitySelector == 4) {
          recordWithSearchedList = this.records.filter(recordItem =>
            recordItem.record.assetItems.some(assetItem => assetItem.assetItemID === this.searchId)
          );
          console.log("recordWithSearchedList: ", recordWithSearchedList);
          recordWithSearchedList.forEach( recordAux => {
            let assetItemAux = recordAux.record.assetItems.find(assetItem => assetItem.assetItemID === this.searchId);
            console.log("assetItemAux: ", assetItemAux);
            
            if (!recordMap.has(JSON.stringify(assetItemAux))) {
              console.log("NOT in map. will add assetItemAux: ", assetItemAux);
              recordMap.set(JSON.stringify(assetItemAux), recordAux);
            }
          });
        }




       /*  let recordWithSearchedList = this.records.filter(recordItem =>
          recordItem.record.assetItems.some(assetItem => assetItem.assetItemID === this.searchId)
        );
        console.log("recordWithSearchedList: ", recordWithSearchedList);
        recordWithSearchedList.forEach( recordAux => {
          let assetItemAux = recordAux.record.assetItems.find(assetItem => assetItem.assetItemID === this.searchId);
          console.log("assetItemAux: ", assetItemAux);
          
          if (!recordMap.has(JSON.stringify(assetItemAux))) {
            console.log("NOT in map. will add assetItemAux: ", assetItemAux);
            recordMap.set(JSON.stringify(assetItemAux), recordAux);
          }
        }); */


        console.log("recordMap: ", recordMap);
        this.spinner.hide();
      },
      error => {
        this.handleError(error, 'Get Audit info failed. Please try again.');
      }
    );
  }

  handleError(error: any, message: string) {
    console.log(error);
    this.notificationServiceService.showNotification('danger', message);
    this.spinner.hide();
  }

  radioChange(event: MatRadioChange) {
    console.log("radiochanged! event.value: ", event.value);
    this.entitySelector = event.value;
  }

  onSubmit(): void {
    console.log('Your order has been submitted', this.auditForm.value.searchId);
    this.searchId = this.auditForm.value.searchId;
    this.auditForm.reset();
    this.getAssetFromSearchId();
  }

  getAssetIdFromAssetItem() {
    return this.assets.filter(asset =>
      asset.assetItems.some(assetItem => assetItem.assetItemID === this.searchId)
    )
    .map(asset =>
      asset.assetID
    )[0];
  }

  getAssetIdFromActor() {
    return this.assets.filter(asset =>
      asset.actors.some(actor => actor.actorID === this.searchId)
    )
    .map(asset =>
      asset.assetID
    )[0];
  }

  getAssetIdFromStep() {
    return this.assets.filter(asset =>
      asset.steps.some(step => step.stepID === this.searchId)
    )
    .map(asset =>
      asset.assetID
    )[0];
  }
}
