import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from '../global.enum';
import { Publication } from '../interfaces/publication';
import { Observable } from 'rxjs/Observable';
import { Params } from '@angular/router';

@Injectable()
export class PublicationService {
	
	private url: string

	public constructor (private http: HttpClient) {
		this.url = Global.url
	}
	
	public addPublication (publication: Publication): Observable<any> {
		const params = JSON.stringify(publication)
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		return this.http.post(this.url + 'publication/publication', params, { headers: headers })
	}
	
	public getPublications (page: number): Observable<any> {
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		return this.http.get(this.url + 'publication/publications/' + page, { headers: headers })
	}

	public deletePublication (id): Observable<any> {
		const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken())
		return this.http.delete(this.url + 'publication/publication/' + id, { headers: headers })
	}

	private getToken () {
		return JSON.parse(localStorage.getItem('token'))
	}
	private getIdentity () {
		return JSON.parse(localStorage.getItem('identity'))
	}

}
