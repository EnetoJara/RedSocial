import { Component, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'
import { User } from '../../interfaces/user'
import { ActivatedRoute, Router } from '@angular/router'
import { Global } from '../../global.enum'
import { PublicationService } from '../../services/publication.service'
import { Publication } from '../../interfaces/publication'
import * as $ from 'jquery'

@Component({
	selector: 'app-time-line',
 	templateUrl: './time-line.component.html',
	providers: [ UserService, PublicationService ]
})
export class TimeLineComponent implements OnInit {
  
	public identity: User
	public token: string
	public title: string
	public url: string
	public status: boolean
	public page: number
	public publications: Publication[]
	public pages: number
	public total: number
	public itemsPerPage: number
	public noMore: boolean

	public constructor (private userService: UserService, private pService: PublicationService, private route: ActivatedRoute, private router: Router) {
		this.identity = this.userService.getIdentity()
		this.title = 'Time Line'
		this.token = this.userService.getToken()
		this.url = Global.url
		this.page = 1;
	}

	public ngOnInit () { 
		this.getPublications(this.page)
	}

	public getPublications (page: number, adding: boolean = false) {
		this.pService.getPublications(page).subscribe(res => {
			if (res.publications) {
				this.total = res.total
				this.itemsPerPage = res.itemsPerPage
				if (!adding) {
					this.noMore = false
					this.publications = res.publications
				} else {
					let arrayA = this.publications
					let arrayB = res.publications
					this.publications = arrayA.concat(arrayB)
					$('html, body').animate({ scrollTop: $('body').prop('scrollHeight') }, 500)
				}
			} else {
				 this.status = false
			}
		}, err => {
			this.status = false
			console.log(<any>err)
		})
	}

	public viewMore () {
		if (this.publications.length === this.total) {
			this.noMore = true
		} else {
			this.getPublications(++this.page, true)
		}
	}

	public refesh (event) {
		this.getPublications(1)
	}
}
