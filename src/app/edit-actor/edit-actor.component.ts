import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '@app/services/asset.service';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { ActorService } from 'app/services/actor.service';
import { NotificationService } from 'app/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-actor',
  templateUrl: './edit-actor.component.html',
  styleUrls: ['./edit-actor.component.scss']
})
export class EditActorComponent implements OnInit {

  assetId: string;
  id: string;
  actor: Actor;
  asset: Asset;
  selectedItemIndex: number

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
    console.log("EditActorComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    this.reloadData();
  }

  reloadData() {
    this.spinner.show();
    this.assetService.getAsset(this.assetId).subscribe(
      data => {
        this.asset = data['data'];
        console.log("asset: ", this.asset);
        this.actor =  this.asset.actors.find(actor => actor.actorID === this.id);
        this.selectedItemIndex = this.asset.actors.findIndex(actor => actor.actorID === this.id);
        console.log("actor: ", this.actor);
        this.spinner.hide();
      },
      error => {
        this.handleError(error, 'get Actor failed. Please try again.');
      }
    );
  }

  onSubmit() {
    this.spinner.show();
    this.asset.actors[this.selectedItemIndex] = this.actor;
    console.log("Submitted! Updated asset: ", this.asset);
    this.assetService.updateAsset(this.assetId, this.asset).subscribe(
      data => {
        console.log(data);
        this.asset = new Asset();
        this.notificationServiceService.showNotification('success', 'Actor succesfully edited');
        this.gotoActorList();
      }, 
      error =>  {
        this.handleError(error, 'Update Actor failed. Please try again.');
      }
    );
  }

  handleError(error: any, message: string) {
    console.log(error);
    this.notificationServiceService.showNotification('danger', message);
    this.spinner.hide();
  }

  gotoActorList() {
    history.back();
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
