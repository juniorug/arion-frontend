import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '@app/services/asset.service';
import { NotificationService } from '@app/services/notification.service';
import { Asset } from 'app/models/asset';
import { Step } from 'app/models/step';
import { StepService } from 'app/services/step.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.component.html',
  styleUrls: ['./step-details.component.scss']
})
export class StepDetailsComponent implements OnInit {

  assetId: string;
  id: string;
  step: Step;
  asset: Asset;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stepService: StepService,
    private spinner: NgxSpinnerService,
    private assetService: AssetService,
    private notificationServiceService: NotificationService
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });
    this.asset = new Asset();
    this.step = new Step();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("StepDetailsComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    this.reloadData();
  }

  reloadData() {
    this.spinner.show();
    this.assetService.getAsset(this.assetId).subscribe(
      data => {
        this.asset = data['data'];
        console.log("asset: ", this.asset);
        this.step =  this.asset.steps.find(step => step.stepID === this.id);
        console.log("step: ", this.step);
        this.spinner.hide();
      },
      error => {
        console.log(error);
        this.notificationServiceService.showNotification('danger', 'get Asset failed. Please try again.');
        this.spinner.hide();
      }
    );
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
