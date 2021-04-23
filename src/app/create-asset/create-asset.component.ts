import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

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


  constructor(private _formBuilder: FormBuilder, private _ref: ChangeDetectorRef) {
    this.assetFormGroup = this._formBuilder.group({
      assetName: ['', Validators.required],
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
  createStep(): FormGroup {
    return this._formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      order: [''],
      actorType: ['', Validators.required]
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
  }

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
    });
  }
  
}
