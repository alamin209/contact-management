import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [],
    loadChildren: () =>
      import('./features/website/website.module').then((m) => m.WebsiteModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
