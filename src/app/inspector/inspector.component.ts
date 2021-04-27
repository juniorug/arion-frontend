import { Component, Input, OnInit } from '@angular/core';
import { AssetItem } from 'app/models/asset-item';
import * as go from 'gojs';

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss']
})
export class InspectorComponent {

  @Input()
  public selectedAssetItem: AssetItem;

  constructor() { }

}
