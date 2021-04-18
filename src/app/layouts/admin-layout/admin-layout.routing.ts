import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { AssetListComponent } from '../../asset-list/asset-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { AssetDetailsComponent } from 'app/asset-details/asset-details.component';
import { CreateAssetComponent } from 'app/create-asset/create-asset.component';
import { EditAssetComponent } from 'app/edit-asset/edit-asset.component';
import { AssetItemDetailsComponent } from 'app/asset-item-details/asset-item-details.component';
import { CreateAssetItemComponent } from 'app/create-asset-item/create-asset-item.component';
import { EditAssetItemComponent } from 'app/edit-asset-item/edit-asset-item.component';
import { MoveAssetItemComponent } from 'app/move-asset-item/move-asset-item.component';
import { TrackAssetItemComponent } from 'app/track-asset-item/track-asset-item.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',                component: DashboardComponent },
    { path: 'user-profile',             component: UserProfileComponent },
    { path: 'table-list',               component: TableListComponent },
    { path: 'assets',                   component: AssetListComponent,          data: {title: 'Assets'} },
    { path: 'create-asset',             component: CreateAssetComponent,        data: {title: 'Create Asset'} },
    { path: 'asset-details/:id',        component: AssetDetailsComponent,       data: {title: 'Asset Details'} },
    { path: 'edit-asset/:id',           component: EditAssetComponent,          data: {title: 'Edit Asset'} },
    { path: 'create-asset-item',        component: CreateAssetItemComponent,    data: {title: 'Create Asset Item'} },
    { path: 'asset-item-details/:id',   component: AssetItemDetailsComponent,   data: {title: 'Asset Item Details'} },
    { path: 'edit-asset-item/:id',      component: EditAssetItemComponent,      data: {title: 'Edit Asset Item'} },
    { path: 'move-asset-item/:id',      component: MoveAssetItemComponent,      data: {title: 'Move Asset Item'} },
    { path: 'track-asset-item/:id',     component: TrackAssetItemComponent,     data: {title: 'track Asset Item'} },
    { path: 'typography',               component: TypographyComponent },
    { path: 'icons',                    component: IconsComponent },
    { path: 'maps',                     component: MapsComponent },
    { path: 'notifications',            component: NotificationsComponent },
];
