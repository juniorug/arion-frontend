import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { ActorService } from 'app/services/actor.service';
import { NotificationService } from 'app/services/notification.service';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-edit-actor',
  templateUrl: './edit-actor.component.html',
  styleUrls: ['./edit-actor.component.scss']
})
export class EditActorComponent implements OnInit {

  assetId: string;
  id: string;
  actor: Actor;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actorService: ActorService,
    private notificationServiceService: NotificationService
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.actor = new Actor();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("EditActorComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    
    /* this.actorService.getactor(this.id)
      .subscribe(data => {
        console.log(data)
        this.actor = data;
      }, error => console.log(error)); */
    this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    let asset: Asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    console.log("asset: ", asset);
    this.actor =  asset.actors.find(actor => actor.actorID === this.id);
    console.log("actor: ", this.actor);
  }

  onSubmit() {
    /* this.actorService.updateActor(this.id, this.actor)
      .subscribe(data => {
        console.log(data);
        this.actor = new Actor();
        this.gotoList();
      }, error => console.log(error)); */
      this.notificationServiceService.showNotification('success', 'Actor succesfully edited');
      this.gotoActorList();

  }


  gotoActorList() {
    history.back();
  }

}
