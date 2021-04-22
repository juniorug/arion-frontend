import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'app/models/actor';
import { Asset } from 'app/models/asset';
import { ActorService } from 'app/services/actor.service';
import * as assetsJson from "../../assets/mock/assets.json";

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.scss']
})
export class ActorDetailsComponent implements OnInit {

  id: string;
  actor: Actor;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actorService: ActorService
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.actor = new Actor();
    this.id = this.route.snapshot.params['id'];
    console.log("ActorDetailsComponent called with this.route.snapshot.params= ", this.route.snapshot.params);
    console.log("ActorDetailsComponent called with id= ", this.id);
    
    /* this.actorService.getActor(this.id)
      .subscribe(data => {
        console.log(data)
        this.actor = data;
      }, error => console.log(error)); */
    this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    let asset: Asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.id);
    console.log("asset: ", asset);
    this.actor =  asset.actors.find(actor => actor.actorID === this.id);
    console.log("actor: ", this.actor);
  }

}
