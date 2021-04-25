import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ActorDetailsComponent } from './actor-details/actor-details.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { AssetItemDetailsComponent } from './asset-item-details/asset-item-details.component';
import { ComponentsModule } from './components/components.module';
import { CreateAssetItemComponent } from './create-asset-item/create-asset-item.component';
import { CreateAssetComponent } from './create-asset/create-asset.component';
import { EditActorComponent } from './edit-actor/edit-actor.component';
import { EditAssetItemComponent } from './edit-asset-item/edit-asset-item.component';
import { EditAssetComponent } from './edit-asset/edit-asset.component';
import { EditStepComponent } from './edit-step/edit-step.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MoveAssetItemComponent } from './move-asset-item/move-asset-item.component';
import { StepDetailsComponent } from './step-details/step-details.component';
import { TrackAssetItemComponent } from './track-asset-item/track-asset-item.component';
import { DiagramComponent } from './diagram/diagram.component';
import { InspectorComponent } from './inspector/inspector.component';


@NgModule({
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    ModalModule.forRoot(),
    MatStepperModule,
    MatSelectModule,
    MatIconModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AssetDetailsComponent,
    CreateAssetComponent,
    EditAssetComponent,
    CreateAssetItemComponent,
    EditAssetItemComponent,
    AssetItemDetailsComponent,
    MoveAssetItemComponent,
    TrackAssetItemComponent,
    ActorDetailsComponent,
    EditActorComponent,
    StepDetailsComponent,
    EditStepComponent,
    DiagramComponent,
    InspectorComponent,

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule { }
