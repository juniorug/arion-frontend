import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { AssetListComponent } from '../../asset-list/asset-list.component';
import { AssetDetailsComponent } from 'app/asset-details/asset-details.component';
import { CreateAssetComponent } from 'app/create-asset/create-asset.component';
import { EditAssetComponent } from 'app/edit-asset/edit-asset.component';
import { AssetItemDetailsComponent } from 'app/asset-item-details/asset-item-details.component';
import { CreateAssetItemComponent } from 'app/create-asset-item/create-asset-item.component';
import { EditAssetItemComponent } from 'app/edit-asset-item/edit-asset-item.component';
import { MoveAssetItemComponent } from 'app/move-asset-item/move-asset-item.component';
import { TrackAssetItemComponent } from 'app/track-asset-item/track-asset-item.component';
import { ActorDetailsComponent } from 'app/actor-details/actor-details.component';
import { EditActorComponent } from 'app/edit-actor/edit-actor.component';
import { EditStepComponent } from 'app/edit-step/edit-step.component';
import { StepDetailsComponent } from 'app/step-details/step-details.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',                component: DashboardComponent },
    { path: 'user-profile',             component: UserProfileComponent },
    { path: 'assets',                   component: AssetListComponent,          data: {title: 'Assets'} },
    { path: 'create-asset',             component: CreateAssetComponent,        data: {title: 'Create Asset'} },
    { path: 'asset-details/:id',        component: AssetDetailsComponent,       data: {title: 'Asset Details'} },
    { path: 'edit-asset/:id',           component: EditAssetComponent,          data: {title: 'Edit Asset'} },

    { path: 'create-asset-item/:assetId',       component: CreateAssetItemComponent,    data: {title: 'Create Asset Item'} },
    { path: 'asset-item-details/:assetId/:id',  component: AssetItemDetailsComponent,   data: {title: 'Asset Item Details'} },
    { path: 'edit-asset-item/:assetId/:id',     component: EditAssetItemComponent,      data: {title: 'Edit Asset Item'} },
    { path: 'move-asset-item/:assetId/:id',     component: MoveAssetItemComponent,      data: {title: 'Move Asset Item'} },
    { path: 'track-asset-item/:assetId/:id',    component: TrackAssetItemComponent,     data: {title: 'track Asset Item'} },

    { path: 'actor-details/:assetId/:id',       component: ActorDetailsComponent,       data: {title: 'Actor Details'} },
    { path: 'edit-actor/:assetId/:id',          component: EditActorComponent,          data: {title: 'Edit Actor'} },

    { path: 'step-details/:assetId/:id',        component: StepDetailsComponent,        data: {title: 'Step Details'} },
    { path: 'edit-step/:assetId/:id',           component: EditStepComponent,           data: {title: 'Edit Step'} },
];
