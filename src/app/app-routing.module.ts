import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageManagement } from './pages/management/pages.management';
import { PageHome } from './pages/home/pages.home';

const routes: Routes = [
  { path: '', component: PageHome },
  { path: 'management', component: PageManagement },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
