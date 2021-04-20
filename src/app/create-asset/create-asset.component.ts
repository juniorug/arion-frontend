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

  ngOnDestroy(): void {
    $(window).ready(()=>{
      document.getElementsByClassName("asset-menu")[0].classList.remove("active");
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
    this.actors = this.actorsFormGroup.get('actors') as FormArray;
    this.actors.push(this.createActor());
    this._ref.detectChanges();
  }

  createStep(): FormGroup {
    return this._formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  addStep(): void {
    this.steps = this.stepsFormGroup.get('steps') as FormArray;
    this.steps.push(this.createStep());
    this._ref.detectChanges();
  }

  resetForm() {
    this.actors.clear();
    this.steps.clear();
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

}
