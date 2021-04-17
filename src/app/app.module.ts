import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { CreateAssetComponent } from './create-asset/create-asset.component';
import { EditAssetComponent } from './edit-asset/edit-asset.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    ModalModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AssetDetailsComponent,
    CreateAssetComponent,
    EditAssetComponent,

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule { }
