import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TasksListComponent } from './subjects/tasks-list/tasks-list.component';

const routes: Routes = [
    { path: '', redirectTo: '/fes', pathMatch: 'full' },
    { path: 'fes', component: TasksListComponent },
//    { path: 'edit/:id', component: SubjectEditComponent }
];

@NgModule( {
    imports: [
        RouterModule.forRoot( routes )
    ],
    exports: [RouterModule]
} )
export class AppRoutingModule { }
