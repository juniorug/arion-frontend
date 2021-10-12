import { Component, OnInit } from '@angular/core';
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

  /**items to rearch */
  asset: Asset;
  actor: Actor;
  step: Step;
  assetItem: AssetItem;

  constructor(
    private spinner: NgxSpinnerService,
    private assetService: AssetService,
    private dataService: DataService,
    private notificationServiceService: NotificationService
  ) { }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
      document.getElementsByClassName("audit")[0].classList.add("active");
    });
    this.asset = new Asset();
    this.assetId = "cb7497f0-47d7-435b-96e2-8d4258517b7a";
    this.searchId = "a544bb43-61c6-48e9-9908-3edc17837dc3";
    console.log("previous asset id : ", this.assetId);
    this.getAssetFromSearchId();
    //this.searchAudit();
  }

  getAssetFromSearchId() {
    this.assetService.getAssetList().subscribe(
      data => {
        this.assets = data['data'];
        console.log("assets: ", this.assets);
        this.assetId = this.assets.filter(asset =>
          asset.assetItems.some(assetItem => assetItem.assetItemID === this.searchId)
        )
        .map(asset =>
          asset.assetID
        )[0];
        this.asset =  this.assets.find(asset => asset.assetID === this.assetId);
        this.assetItem =  this.asset.assetItems.find(assetItem => assetItem.assetItemID === this.searchId);
        console.log("FOUND ASSET ID : ", this.assetId);
        console.log("FOUND assetItem : ", this.assetItem);
        console.log("FOUND ASSET : ", this.asset);
        console.log("will call searchaudit");
        this.searchAudit();
      },
      error => {
        this.notificationServiceService.showNotification('danger', 'get Asset List failed. Please try again.');
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

        let recordAux = this.records.filter(recordItem =>
          recordItem.record.assetItems.some(assetItem => assetItem.assetItemID === this.searchId)
        )[0];
        /* .map(recordItem =>
          recordItem.record.assetItems.findIndex(assetItem => assetItem.assetItemID === this.searchId)
        )[0]; */
        console.log("record: ", recordAux);
        let assetItemAux = recordAux.record.assetItems.find(assetItem => assetItem.assetItemID === this.searchId);
        console.log("assetItemAux: ", assetItemAux);
        
        if (!recordMap.has(assetItemAux)) {
          recordMap.set(assetItemAux, recordAux);
        }
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

}
