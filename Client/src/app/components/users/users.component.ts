import { Component, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'
import { Router, ActivatedRoute } from '@angular/router'
import { User } from '../../interfaces/user'
import { Global } from '../../global.enum'
import { FollowService } from '../../services/follow.service';
import { Follow } from '../../interfaces/follow';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	providers: [ UserService, FollowService ]
})

export class UsersComponent implements OnInit {
	
	public title: string
	public users: User[]
	public page: any
	public nPage: any
	public pPage: any
	public status: boolean
	public pages: any
	private total: any
	public url: string
	public follows: any
	public followUserOver: string
	public identity: User

	public constructor (private userService: UserService, private router: Router, private route: ActivatedRoute, private followService: FollowService) { 
		this.title = 'Gente'
		this.url = Global.url
		this.identity = this.userService.getIdentity()
	}

	public ngOnInit () { 
		this.actualPage()
	}

	public actualPage () {
		this.route.params.subscribe(res => {
			this.page = (res['page'] && !isNaN(res['page'])) ? res['page'] * 1 : 1 
			this.nPage = this.page + 1
			this.pPage = (this.page > 1) ? this.page - 1 : 1
			this.getUsers(this.page)

		})
	}

	private getUsers (page: number) {
		this.userService.getUsers(page).subscribe(res => {
			if (!res.users) {
				this.status = false
			} else {
				this.total = res.total
				this.users = res.users
				this.pages = res.pages
				this.follows = res.usersFollowing
				if (page > this.pages) {
					this.router.navigate(['/gente', 1])
				}
			}
		}, err => {
			console.log(<any>err)
			this.status = false
		})
	}
	
	public addFollow (followed: string) {
		const follow: Follow = { _id: null, user: this.identity._id, followed: followed }
		this.followService.addFollow(follow).subscribe(res => {
			if ( !res.follow ) {
				this.status = false
			} else {
				this.status = true
				this.follows.push( followed )
			}
		}, err => {

		})
	}

	public unFollow (followed: string) {
		this.followService.deleteFollow(followed).subscribe(res => {
			let search = this.follows.indexOf(followed)
			if (search !== -1) {
				this.follows.splice(search, 1)
			}
		})
	}

	public mouseEnter ( id: string ) { this.followUserOver = id }
	public mouseLeave (id: string) { this.followUserOver = '' }
}
