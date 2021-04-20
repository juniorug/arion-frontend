import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.scss']
})
export class CreateAssetComponent implements OnInit {

  assetFormGroup: FormGroup;
  actorsFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = true;


  arrayActors: {
    id: number;
    name: string;
    type: string;
  }[];

  constructor(private _formBuilder: FormBuilder) {
    this.assetFormGroup = this._formBuilder.group({
      assetName: ['', Validators.required],
      description: ['']
    });
    this.actorsFormGroup = this._formBuilder.group({
      actorsFormArray: this._formBuilder.array([])
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });

    this.arrayActors = [];
    this.addItem();
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }

  get actorsFormArray() {
    return this.actorsFormGroup.get('actorsFormArray') as FormArray;
  }

  addItem() {
    console.log("addItem called");
    
    let newActor = {
      id: this.actorsFormArray.length + 1,
      name:  "",
      type: "",
    }
    this.arrayActors.push(newActor);
    this.actorsFormArray.push(this._formBuilder.control(false));
  }
  removeItem() {
    this.arrayActors.pop();
    this.actorsFormArray.removeAt(this.actorsFormArray.length - 1);
  }
}
