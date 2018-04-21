import { Injectable } from '@angular/core'
import { Global } from '../global.enum'

@Injectable()
export class UploadService {
	private url: string
	public constructor() { 
		this.url = Global.url
	}

	public makeFile (url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
		return new Promise((res, reject) => {
			const formData: any = new FormData()
			const xhr = new XMLHttpRequest()
			for (let i = 0; i < files.length; i++) { formData.append(name, files[i], files[i].name) }
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) { 
						res(JSON.parse(xhr.response))
					} else {
						reject(xhr.response)
					}
				}
			}
			xhr.open('POST', url, true)
			xhr.setRequestHeader('Authorization', token)
			xhr.send(formData)
		})
	}

}
