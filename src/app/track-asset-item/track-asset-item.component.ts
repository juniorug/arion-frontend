import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'app/models/asset';
import { AssetItem } from 'app/models/asset-item';
import { AssetItemService } from 'app/services/asset-item.service';
import * as assetsJson from "../../assets/mock/assets.json";
import * as go from 'gojs';


@Component({
  selector: 'app-track-asset-item',
  templateUrl: './track-asset-item.component.html',
  styleUrls: ['./track-asset-item.component.scss']
})
export class TrackAssetItemComponent implements OnInit {

  assetId: string;
  id: string;
  assetItem: AssetItem;

  /* GoJs diagram variables: public selectedNode = null;*/
  public selectedNode = null;

  public model: go.TreeModel = new go.TreeModel(
    [
      { 'key': 1, 'name': 'Stella Payne Diaz', 'title': 'CEO' },
      { 'key': 2, 'name': 'Luke Warm', 'title': 'VP Marketing/Sales', 'parent': 1 },
      { 'key': 3, 'name': 'Meg Meehan Hoffa', 'title': 'Sales', 'parent': 2 },
      { 'key': 4, 'name': 'Peggy Flaming', 'title': 'VP Engineering', 'parent': 1 },
      { 'key': 5, 'name': 'Saul Wellingood', 'title': 'Manufacturing', 'parent': 4 },
      { 'key': 6, 'name': 'Al Ligori', 'title': 'Marketing', 'parent': 2 },
      { 'key': 7, 'name': 'Dot Stubadd', 'title': 'Sales Rep', 'parent': 3 },
      { 'key': 8, 'name': 'Les Ismore', 'title': 'Project Mgr', 'parent': 5 },
      { 'key': 9, 'name': 'April Lynn Parris', 'title': 'Events Mgr', 'parent': 6 },
      { 'key': 10, 'name': 'Xavier Breath', 'title': 'Engineering', 'parent': 4 },
      { 'key': 11, 'name': 'Anita Hammer', 'title': 'Process', 'parent': 5 },
      { 'key': 12, 'name': 'Billy Aiken', 'title': 'Software', 'parent': 10 },
      { 'key': 13, 'name': 'Stan Wellback', 'title': 'Testing', 'parent': 10 },
      { 'key': 14, 'name': 'Marge Innovera', 'title': 'Hardware', 'parent': 10 },
      { 'key': 15, 'name': 'Evan Elpus', 'title': 'Quality', 'parent': 5 },
      { 'key': 16, 'name': 'Lotta B. Essen', 'title': 'Sales Rep', 'parent': 3 }
    ]
  );


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetItemService: AssetItemService
  ) { }

  ngOnInit(): void {
    
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.assetItem = new AssetItem();
    this.assetId = this.route.snapshot.params['assetId'];
    this.id = this.route.snapshot.params['id'];
    console.log("TrackAssetItemComponent called with assetId= ", this.assetId, " and id= ", this.id, );
    
    /* this.assetItemService.getAssetItem(this.id)
      .subscribe(data => {
        console.log(data)
        this.assetItem = data;
      }, error => console.log(error)); */
    this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    let asset: Asset =  assetsJson['default'].find(assetUpper => assetUpper.assetID === this.assetId);
    console.log("asset: ", asset);
    this.assetItem =  asset.assetItems.find(assetItem => assetItem.assetItemID === this.id);
    console.log("assetItem: ", this.assetItem);
  }

  public setSelectedNode(node) {
    this.selectedNode = node;
  }
  
  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

}
