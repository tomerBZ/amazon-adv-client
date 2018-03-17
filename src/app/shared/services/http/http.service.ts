import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../interfaces/product';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {
  }

  fetchAll(): Promise<Product[]> {
    return this.http.get<Product[]>('https://amazon-adv-api.herokuapp.com/')
        .toPromise()
        .then((response) => response)
        .catch((error) => Promise.reject(error.message || error));
  }

  search(ASIN: string): Observable<any> {
    return this.http.get(`https://amazon-adv-api.herokuapp.com/search/${ASIN}`)
      .map(response => response)
      .catch(error => Observable.throw(error));
  }

  delete(id: string): Observable<any> {
    return this.http.post('https://amazon-adv-api.herokuapp.com/delete/', {id: id})
      .map(data => data)
      .catch(error => Observable.throw(error));
  }
}
