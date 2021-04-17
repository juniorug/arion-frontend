import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { AssetService } from "../services/asset.service";
import { Asset } from "../models/asset";
import { Router } from '@angular/router';
import * as assetsJson from "../../assets/mock/assets.json";
@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {

  //assets: Observable<Asset[]>;
  assets: any[];

  constructor(
    private assetService: AssetService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    //this.assets = this.assetService.getAssetList();
    this.assets =  assetsJson['default'];
    console.log("assets: ", this.assets);
  }

  createAsset() {
    this.router.navigate(['create']);
  }

  deleteAsset(id: number) {
    this.assetService.deleteAsset(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }

  assetDetails(id: number){
    this.router.navigate(['details', id]);
  }

  editAsset(id: number){
    this.router.navigate(['update', id]);
  }

}
