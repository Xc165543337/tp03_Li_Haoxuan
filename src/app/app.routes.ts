import { Routes } from '@angular/router'
import { PollutionCreateComponent } from './pollution-create/pollution-create.component'
import { PollutionDetailComponent } from './pollution-detail/pollution-detail.component'
import { PollutionEditComponent } from './pollution-edit/pollution-edit.component'
import { PollutionListComponent } from './pollution-list/pollution-list.component'

export const routes: Routes = [
  { path: '', component: PollutionListComponent },
  { path: 'pollution/:id', component: PollutionDetailComponent },
  { path: 'pollution/:id/edit', component: PollutionEditComponent },
  { path: 'create', component: PollutionCreateComponent },
]
