import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';

import { MatStepperModule } from '@angular/material/stepper';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { CreateAssetComponent } from './create-asset/create-asset.component';
import { EditAssetComponent } from './edit-asset/edit-asset.component';
import { CreateAssetItemComponent } from './create-asset-item/create-asset-item.component';
import { EditAssetItemComponent } from './edit-asset-item/edit-asset-item.component';
import { AssetItemDetailsComponent } from './asset-item-details/asset-item-details.component';
import { MoveAssetItemComponent } from './move-asset-item/move-asset-item.component';
import { TrackAssetItemComponent } from './track-asset-item/track-asset-item.component';

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

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule { }
