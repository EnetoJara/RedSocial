import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { HomeComponent } from './components/home/home.component'
import { UserEditComponent } from './components/user-edit/user-edit.component'
import { UsersComponent } from './components/users/users.component'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'
import { TimeLineComponent } from './components/time-line/time-line.component'
import { ProfileComponent } from './components/profile/profile.component';

const APP_ROUTES: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'registro', component: RegisterComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'mis-datos', component: UserEditComponent },
	{ path: 'gente/:page', component: UsersComponent },
	{ path: 'gente', component: UsersComponent },
	{ path: 'time-line', component: TimeLineComponent },
	{ path: 'perfil/:id', component: ProfileComponent },
	{ path: '**', component: PageNotFoundComponent }
]

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES)
