import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { DetailComponent } from './components/detail/detail.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'pokemon/:name', component: DetailComponent },
  { path: '**', redirectTo: '' }
];
