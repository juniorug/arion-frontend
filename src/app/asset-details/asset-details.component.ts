import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    document.getElementsByClassName("asset-menu")[0].classList.add("active");
  }

}
