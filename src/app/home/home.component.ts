import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/interfaces/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../shared/services/http/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[];
  searchForm: FormGroup;
  serverError: boolean;
  errorMessage: string;

  constructor(private _http: HttpService, private builder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
    this._http.fetchAll().then(products => this.products = products, error => console.log('i am error', error));
  }

  deleteMe(id) {
    this._http.delete(id).subscribe(response => {
      if (response.success) {
        this.products = this.products.filter((product) => product._id !== id);
      }
    }, error2 => {
      console.log(error2);
    });
  }

  buildForm(): void {
    this.searchForm = this.builder.group({
      'search': [null, []]
    });
    this.searchForm.get('search').valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(searchTerm => {
        this._http.search(searchTerm)
          .filter((result) => result !== null)
          .subscribe(product => {
            this.products = this.products.concat(product);
            this.searchForm.get('search').reset();
          }, (error) => {
            console.log(error);
            if (error.status === 404) {
              setTimeout(() => {
                this.serverError = false;
                this.errorMessage = '';
              }, 3000);
              this.serverError = true;
              this.errorMessage = 'Product doesn\'t exist';
            }
          });
      }, (error) => {
        console.log(error);
      });
  }
}
