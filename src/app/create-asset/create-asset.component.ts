import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Actor } from 'app/models/actor';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.scss']
})
export class CreateAssetComponent implements OnInit {

  assetFormGroup: FormGroup;
  actorsFormGroup: FormGroup;
  stepsFormGroup: FormGroup;
  isEditable = true;

  actors: FormArray;
  steps: FormArray;
  actorTypes: string[];


  constructor(private _formBuilder: FormBuilder, private _ref: ChangeDetectorRef, private notificationServiceService: NotificationService) {
    this.assetFormGroup = this._formBuilder.group({
      assetName: [''],
      description: ['']
    });
    this.actorsFormGroup = this._formBuilder.group({
      actors: this._formBuilder.array([ this.createActor()  ])
    });
    this.stepsFormGroup = this._formBuilder.group({
      steps: this._formBuilder.array([ this.createStep()  ])
    });
  }

  ngOnInit(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.add("active");
    });
    this.actorTypes = new Array();
  }

  createActor(): FormGroup {
    return this._formBuilder.group({
      id: [''],
      name: [''],
      type: ['']
    });
  }

  addActor(): void {
    console.log("addActor called")
    this.actors = this.actorsFormGroup.get('actors') as FormArray;
    this.actors.push(this.createActor());
    this._ref.detectChanges();
  }

  removeActor(id): void {
    console.log("removeActor called with id: ", id);
    this.actors = this.actorsFormGroup.get('actors') as FormArray;
    this.actors.removeAt(id);
    this._ref.detectChanges();
  }

  updateActorTypes() {
    this.actorTypes = new Array();
    this.actorTypes = this.actorsFormGroup.get('actors').value
      .map(actor => actor.type)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  createStep(): FormGroup {
    return this._formBuilder.group({
      id: [''],
      name: [''],
      order: [''],
      actorType: ['']
    });
  }

  addStep(): void {
    this.steps = this.stepsFormGroup.get('steps') as FormArray;
    this.steps.push(this.createStep());
    this._ref.detectChanges();
    for (let i = 0; i < this.steps.value.length; i++  ) {
      this.steps.value[i]['order'] = i + 1;
    }
  }

  removeStep(id): void {
    this.steps = this.stepsFormGroup.get('steps') as FormArray;
    this.steps.removeAt(id);
    this._ref.detectChanges();
  }

  updateStepOrder() {
    this.steps = this.stepsFormGroup.get('steps') as FormArray;
    for (let i = 0; i < this.steps.value.length; i++  ) {
      this.steps.value[i]['order'] = i + 1;
    }
    
  }

  resetForm() {
    this.actors.clear();
    this.steps.clear();
    this.assetFormGroup.reset();
    this.assetFormGroup.markAsPristine();
    this.assetFormGroup.markAsUntouched();
    this.resetFormGroup(this.assetFormGroup);
    this.resetFormGroup(this.actorsFormGroup);
    this.resetFormGroup(this.stepsFormGroup);
    this.addActor();
    this.addStep();
  }

  resetFormGroup(form: FormGroup ) {
    form.reset(form.value);
    form.markAsPristine();
    form.markAsUntouched();
  }

  createAsset() {
    this.updateStepOrder();
    console.log("assetFormGroup", this.assetFormGroup.value);
    console.log("actorsFormGroup", this.actorsFormGroup.value);
    console.log("stepsFormGroup", this.stepsFormGroup.value);

    this.gotoAssetList();
    this.notificationServiceService.showNotification('success', 'Asset succesfully created');

  }

  gotoAssetList() {
    history.back();
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }
  
}
