import { Injectable } from '@angular/core'
import { User } from '../interfaces/user'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { Global } from '../global.enum'

@Injectable()
export class UserService {
	
	private user: User
	private url: Global

	public constructor(private http: HttpClient) { 
		this.url = Global.url
		this.user = { _id: null, name: '', surname: '', nick: '', email: '', password: '', role: 'ROLE_USER', image: '', getToken: false }
	}
	
	public save (user: User): Observable <any> {
		const params = JSON.stringify(user)
		const headers = new HttpHeaders().set('Content-type', 'application/json')
		return this.http.post(this.url + 'user/register', params, { headers: headers })
	}

	public logIn (user: User, getToken: boolean = false): Observable <any> {
		user.getToken = getToken
		const headers = new HttpHeaders().set('Content-Type', 'application/json')
		const params = JSON.stringify(user)
		return this.http.post(this.url + 'user/login', params, { headers })
	}

	public getCounters (userID: string = null): Observable <any> {
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		const url = (userID !== null) ? 'user/counters/' + userID : 'user/counters'
		return this.http.get(this.url + url, { headers: headers })
	}

	public updateUser (user: User): Observable <any> {
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		const params = JSON.stringify(user)
		return this.http.put(this.url + 'user/update/' + user._id , params, { headers: headers })
	}

	public getUsers (page: number = null): Observable <any> {
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		const url = (page && !isNaN(page)) ?  'user/users/' + page : 'user/users'
		return this.http.get(this.url + url, { headers: headers })
	}

	public getUser (id: string): Observable <any> {
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		return this.http.get(this.url + 'user/user/' + id, { headers: headers })
	}

	public getToken () { return JSON.parse(localStorage.getItem('token')) }

	public getIdentity () { return JSON.parse(localStorage.getItem('identity')) }

	public getStats () { return JSON.parse(localStorage.getItem('stats')) }

}
