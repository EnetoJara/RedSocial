import { Component, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'
import { FollowService } from '../../services/follow.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Global } from '../../global.enum'
import { User } from '../../interfaces/user';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	providers: [ FollowService, UserService ],
	styles: []
})
export class ProfileComponent implements OnInit {
	
	public url: string
	public title: string
	public user: User
	public status: boolean
	public stats: string
	public follow: any

	public constructor (private uService: UserService, private fService: FollowService, private router: Router, private route: ActivatedRoute) { 
		this.url = Global.url
		this.title = 'Perfil'
	}

	ngOnInit() {
		this.loadPage()
	}
	
	public loadPage () {
		this.route.params.subscribe(params => {
			this.getUser(params['id'])
		})
	}

	public getUser (id: string) {
		this.uService.getUser(id).subscribe(res => {
			if (res.user) {
				this.user = res.user
				this.getCounters(id)
			} else {
				this.status = false
			}
		}, err => {
			console.log(<any>err)
			this.router.navigate(['/404'])
		})
	}

	public getCounters (id: string) {
		this.uService.getCounters(id).subscribe(res => {
			console.log(res)
			localStorage.setItem('stats', JSON.stringify(res))
			this.stats = res
		}, err => {
			console.log(<any>err)
		})
	}

}
