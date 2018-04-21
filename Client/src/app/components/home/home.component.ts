import { Component, OnInit, OnDestroy } from '@angular/core'
import { User } from '../../interfaces/user'

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

	public user: User
	public title: string
	public constructor () { 
		this.title = 'Welcome to Neto\'s Company'
	}

	public ngOnInit () { }

	public ngOnDestroy () { }

}
