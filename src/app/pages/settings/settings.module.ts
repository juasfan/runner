import { NgModule } from '@angular/core';
import { SettingsPage } from './settings.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
