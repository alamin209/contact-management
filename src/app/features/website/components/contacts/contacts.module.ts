import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsContactsComponent } from './ws-contacts/ws-contacts.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [WsContactsComponent],
  imports: [CommonModule, ContactsRoutingModule, SharedModule],
})
export class ContactsModule {}
