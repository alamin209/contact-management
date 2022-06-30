import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WsContactsComponent } from './ws-contacts/ws-contacts.component';

const routes: Routes = [
  {
    path: '',
    component: WsContactsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
