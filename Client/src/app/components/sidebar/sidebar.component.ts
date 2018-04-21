import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { UserService } from '../../services/user.service'
import { User } from '../../interfaces/user'
import { Global } from '../../global.enum'
import { Publication } from '../../interfaces/publication'
import { PublicationService } from '../../services/publication.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	providers: [ UserService, PublicationService ]
})

export class SidebarComponent implements OnInit {

	public identity: User
	public stats: any
	public url: string
	public status: boolean
	public publication: Publication
	@Output() sended = new EventEmitter()

	public constructor ( private routes: ActivatedRoute, private router: Router, private userService: UserService, private pService: PublicationService ) {
		this.identity = this.userService.getIdentity()
		this.url = Global.url
		this.stats = this.userService.getStats()
		this.publication = { _id: null, text: '', file: null, created_at: null, user: null }
	}

	public ngOnInit () { }

	public sendForm (form) {
		this.pService.addPublication(this.publication).subscribe(res => {
			if (!res.publication._id) {
				this.status = false
			} else {
				this.status = true
			}
			form.reset()
			this.router.navigate(['/time-line'])
		}, err => {
			form.reset()
			this.status = false
			console.log(<any>err)
		})
	}

	public sendPublication (event) {
		this.sended.emit({ send: true })
	}
}
