import { Component, OnInit, OnDestroy } from '@angular/core'
import { User } from '../../interfaces/user'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { UserService } from '../../services/user.service'

	@Component({
		selector: 'app-register',
		templateUrl: './register.component.html',
		providers: [ UserService ]
	})
export class RegisterComponent implements OnInit, OnDestroy {

	public title: string
	public user: User
	public status: boolean

	public constructor (private router: Router, private route: ActivatedRoute, private userService: UserService) {
		this.title = 'Registrate'
		this.user = { _id: null, name: '', surname: '', nick: '', email: '', password: '', role: 'ROLE_USER', image: '', getToken: false }
	}

	public ngOnInit () { }

	public ngOnDestroy () { 
		this.title = null
	}
	
	public sendForm (form) {
		this.userService.save(this.user).subscribe(res => {
			if (res && res.user && res.user._id) {
				this.status = true
			} else {
				this.status = false
			}
			form.reset()
		}, err => {
			this.status = false
			console.log(<any>err)
		})
	}
}
