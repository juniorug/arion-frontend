import { Component, Input, OnInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss']
})
export class InspectorComponent {

  public _selectedNode: go.Node;
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

  @Input()
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
  }

  constructor() { }

}
