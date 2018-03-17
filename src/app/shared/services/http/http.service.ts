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
    return this.http.get<Product[]>('http://localhost:3000/')
        .toPromise()
        .then((response) => response)
        .catch((error) => Promise.reject(error.message || error));
  }

  search(ASIN: string): Observable<any> {
    return this.http.get(`http://localhost:3000/search/${ASIN}`)
      .map(response => response)
      .catch(error => Observable.throw(error));
  }

  delete(id: string): Observable<any> {
    return this.http.post('http://localhost:3000/delete/', {id: id})
      .map(data => data)
      .catch(error => Observable.throw(error));
  }
}
