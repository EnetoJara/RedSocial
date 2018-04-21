import { Component, OnInit } from '@angular/core'
import { User } from '../../interfaces/user'
import { UserService } from '../../services/user.service'
import { ActivatedRoute, Router } from '@angular/router'
import { UploadService } from '../../services/upload.service'
import { Global } from '../../global.enum'

@Component({
	selector: 'app-user-edit',
	templateUrl: './user-edit.component.html',
	providers: [ UserService, UploadService ]
})
export class UserEditComponent implements OnInit {

	public user: User
	public title: string
	public status: boolean
	public fileList: Array<File>
	public url: string

	public constructor(private userService: UserService, private router: Router, 
					private route: ActivatedRoute, private upload: UploadService) {
		this.title = 'Actualizar mis Datos'
		this.user = this.userService.getIdentity()
		this.url = Global.url
	}

	public ngOnInit() { }

	public sendForm (form) {
		this.userService.updateUser(this.user).subscribe(res => {
			if (!res.user) {
				this.status = false
			} else {
				this.status = true
				localStorage.setItem('identity', JSON.stringify(res.user))
				this.upload.makeFile(Global.url + 'user/uploadImage/' + this.user._id, [], this.fileList, this.userService.getToken(), 'image')
				.then((result: any) => {
					this.user.image = result.user.image
					localStorage.setItem('identity', JSON.stringify(this.user))
				})
			}
		}, err => {
			this.status = false
			console.log(<any>err)
		})
	}

	public fileChange (fileInput: any) {
		this.fileList = <Array<File>>fileInput.target.files
	}

}
