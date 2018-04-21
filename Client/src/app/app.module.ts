import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { routing } from './app.routes'
import { HomeComponent } from './components/home/home.component'
import { UserEditComponent } from './components/user-edit/user-edit.component'
import { UsersComponent } from './components/users/users.component'
import { SidebarComponent } from './components/sidebar/sidebar.component'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'
import { TimeLineComponent } from './components/time-line/time-line.component'
import { MomentModule } from 'angular2-moment'
import { ProfileComponent } from './components/profile/profile.component'

@NgModule({
	declarations: [
		AppComponent, LoginComponent,
		RegisterComponent, HomeComponent,
		UserEditComponent, UsersComponent, 
		SidebarComponent, PageNotFoundComponent, 
		TimeLineComponent, ProfileComponent
	],
	imports: [ BrowserModule, routing, FormsModule, HttpClientModule, MomentModule ], 
	providers: [], 
	bootstrap: [ AppComponent ]
})
export class AppModule { }
