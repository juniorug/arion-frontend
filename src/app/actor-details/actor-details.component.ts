import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '@app/services/asset.service';
import { NotificationService } from '@app/services/notification.service';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { ActorService } from 'app/services/actor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.scss']
})
export class ActorDetailsComponent implements OnInit {

  assetId: string;
  id: string;
  actor: Actor;
  asset: Asset;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actorService: ActorService,
    private spinner: NgxSpinnerService,
    private assetService: AssetService,
    private notificationServiceService: NotificationService
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.asset = new Asset();
    this.actor = new Actor();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("ActorDetailsComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    this.reloadData();
  }

  reloadData() {
    this.spinner.show();
    this.assetService.getAsset(this.assetId).subscribe(
      data => {
        this.asset = data['data'];
        console.log("asset: ", this.asset);
        this.actor =  this.asset.actors.find(actor => actor.actorID === this.id);
        console.log("actor: ", this.actor);
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
