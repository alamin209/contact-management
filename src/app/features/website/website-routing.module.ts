import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsiteLayoutComponent } from './website-layout/website-layout.component';

const routes: Routes = [
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'contacts',
      },
      {
        path: 'contacts',
        pathMatch: 'full',
        loadChildren: () =>
          import('./components/contacts/contacts.module').then(
            (m) => m.ContactsModule
          ),
        data: {
          title: 'Contacts',
          listTitle: 'Contact List',
          addTitle: 'Add New Contact',
          editTitle: 'Edit Contact Information',
          deleteTitle: 'Delete Contact Information',
          detailsTitle: 'Show Contact Information',
          path: 'contacts',
        },
      },
      {
        path: '404',
        loadChildren: () =>
          import('./components/page-not-found/page-not-found.module').then(
            (m) => m.PageNotFoundModule
          ),
        data: {
          title: 'Page Not Found',
        },
      },
      { path: '**', redirectTo: '/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
