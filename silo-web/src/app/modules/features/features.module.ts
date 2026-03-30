import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { SharedModule } from '@sharedWeb/shared.module';
import { NotificationsPanelComponent } from './components/notifications-panel/notifications-panel.component';
import { HeaderSearchPanelComponent } from './components/header-search-panel/header-search-panel.component';
import { PlatformSupportInfoComponent } from './components/platform-support-info/platform-support-info.component';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    HeaderSearchPanelComponent,
    MenuComponent,
    NotificationsPanelComponent,
    PlatformSupportInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
