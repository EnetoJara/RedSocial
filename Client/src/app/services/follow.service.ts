import { Injectable } from '@angular/core'
import { User } from '../interfaces/user'
import { Follow } from '../interfaces/follow'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { Global } from '../global.enum'

@Injectable()
export class FollowService {
	
	public url: string
	
	public constructor(private http: HttpClient) { 
		this.url = Global.url
	}
	
	public addFollow (follow: Follow): Observable<any> {
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		return this.http.post(this.url + 'follow/follow', JSON.stringify(follow), { headers: headers })
	}

	public deleteFollow (id): Observable<any> {
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		return this.http.delete(this.url + 'follow/follow/' + id, { headers: headers })
	}

	public getToken () { return JSON.parse(localStorage.getItem('token')) }
}
