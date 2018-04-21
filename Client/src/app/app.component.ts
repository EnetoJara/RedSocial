import { Component, DoCheck, OnInit } from '@angular/core'
import { UserService } from '../app/services/user.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Global } from './global.enum'
import { User } from './interfaces/user'

@Component({
selector: 'app-root',
	templateUrl: './app.component.html',
	providers: [ UserService ]
})
export class AppComponent implements DoCheck, OnInit {
	
	public title: string
	public identity: User
	public token: string
	public url: string
	
	public constructor (private userService: UserService, private router: Router, private route: ActivatedRoute) {
		this.title = 'Neto\'s Company'
		this.identity = this.userService.getIdentity()
		this.token = this.userService.getToken()
		this.url = Global.url
	}

	public ngDoCheck () { this.identity = this.userService.getIdentity() }

	public ngOnInit () { }

	private logOut () {
		localStorage.clear()
		this.identity = null
		this.token = null
		this.router.navigate(['/'])
	}
	
}
