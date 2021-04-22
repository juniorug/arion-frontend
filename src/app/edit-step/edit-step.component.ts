import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'app/models/asset';
import { Step } from 'app/models/step';
import { StepService } from 'app/services/step.service';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-edit-step',
  templateUrl: './edit-step.component.html',
  styleUrls: ['./edit-step.component.scss']
})
export class EditStepComponent implements OnInit {

  assetId: string;
  id: string;
  step: Step;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stepService: StepService
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.step = new Step();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("StepDetailsComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    
    /* this.stepService.getStep(this.id)
      .subscribe(data => {
        console.log(data)
        this.step = data;
      }, error => console.log(error)); */
    this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    let asset: Asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    console.log("asset: ", asset);
    this.step =  asset.steps.find(step => step.stepID === this.id);
    console.log("step: ", this.step);
  }

}