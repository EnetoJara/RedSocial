import { Component, OnInit, OnDestroy } from '@angular/core'
import { User } from '../../interfaces/user'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { UserService } from '../../services/user.service'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	providers: [ UserService ]
}) 
export class LoginComponent implements OnInit, OnDestroy {
	
	public title: string
	public user: User
	public status: boolean

	public constructor(private service: UserService, private router: Router, private route: ActivatedRoute) { 
		this.title = 'Identificate'
		this.user = { _id: null, name: '', surname: '', nick: '', email: '', password: '', role: 'ROLE_USER', image: '', getToken: false }
	}
	
	public ngOnInit () { }

	public ngOnDestroy () {
		this.title = null
		this.user = null
		this.status = null
	}

	public sendForm (form) {
		this.service.logIn(this.user).subscribe(res => {
			if (res && res.user && res.user._id) {
				localStorage.setItem('identity', JSON.stringify(res.user))
				this.getToken()
			} else {
				this.status = false
			}
			form.reset()
		}, err => {
			this.status = false
			form.reset()
			console.log(<any>err)
		})
	}

	private getToken () {
		this.service.logIn(this.user, true).subscribe(res => {
			if (res && res.token && res.token.length > 0) {
				localStorage.setItem('token', JSON.stringify(res.token))
				this.getCounters()
			} else {
				this.status = false
			}
		}, err => {
			this.status = false
			console.log(<any>err)
		})
	}

	private getCounters () {
		this.service.getCounters().subscribe(res => {
			localStorage.setItem('stats', JSON.stringify(res))
			this.status = true
			this.router.navigate(['/'])
		}, err => {
			console.log(<any> err)
			this.status = false
		})
	}
}
