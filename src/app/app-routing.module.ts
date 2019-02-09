import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'popover', loadChildren: './popover/popover.module#PopoverPageModule' },
  { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot( 
      routes,
      { useHash: false, enableTracing: false }
    ), 

  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
