import { Component, Input, OnInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss']
})
export class InspectorComponent {

  public selectedNode: boolean;
  public data = {
    key: null,
    step: null,
    owner: null,
    parent: null,
    processDate: null,
    deliveryDate: null,
    orderPrice: null,
    shippingPrice: null,
    status: null,
    quantity: null,
    aditionalInfoMap: null
  };

  @Input()
  public model: go.Model;

  //@Input()
  public selectedKey: string ="777999";

  /* @Input()
  get selectedNode() { return this._selectedNode; }
  set selectedNode(node: go.Node) {
    if (node && node != null) {
      this._selectedNode = node;
      this.data.key = this._selectedNode.data.key;
      this.data.step = this._selectedNode.data.step;
      this.data.owner = this._selectedNode.data.owner;
      this.data.parent = this._selectedNode.data.parent;
      this.data.processDate = this._selectedNode.data.processDate;
      this.data.deliveryDate = this._selectedNode.data.deliveryDate;
      this.data.orderPrice = this._selectedNode.data.orderPrice;
      this.data.shippingPrice = this._selectedNode.data.shippingPrice;
      this.data.status = this._selectedNode.data.status;
      this.data.quantity = this._selectedNode.data.quantity;
      this.data.aditionalInfoMap = this._selectedNode.data.aditionalInfoMap;
    } else {
      this._selectedNode = null;
    }
  } */

  constructor() { }

  ngOnInit(): void {
    this.selectedNode = false;
    this.data = {
      key: null,
      step: null,
      owner: null,
      parent: null,
      processDate: null,
      deliveryDate: null,
      orderPrice: null,
      shippingPrice: null,
      status: null,
      quantity: null,
      aditionalInfoMap: null
    };
  }

  public ngAfterViewInit() {
    let nodeDataArray = this.model.findNodeDataForKey(this.selectedKey);
    console.log("nodeDataArray: ", nodeDataArray);
    
     if (nodeDataArray && nodeDataArray != null) {
      //this.selectedNode = true;
      this.data.key = nodeDataArray.key;
      this.data.step = nodeDataArray.step;
      this.data.owner = nodeDataArray.owner;
      this.data.parent = nodeDataArray.parent;
      this.data.processDate = nodeDataArray.processDate;
      this.data.deliveryDate = nodeDataArray.deliveryDate;
      this.data.orderPrice = nodeDataArray.orderPrice;
      this.data.shippingPrice = nodeDataArray.shippingPrice;
      this.data.status = nodeDataArray.status;
      this.data.quantity = nodeDataArray.quantity;
      this.data.aditionalInfoMap = nodeDataArray.aditionalInfoMap;
    }

    //console.log(" this.data: ",  this.data);
  
  }
}
