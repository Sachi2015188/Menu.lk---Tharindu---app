import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Reference } from "@firebase/database-types";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { IApiConfig, IFireConfig, IRestaurants } from "../interfaces";

@Injectable()
export class ApiProvider {
  
  constructor(public http: HttpClient, public afDb: AngularFireDatabase) {}

  configureRequest({ fireConfig, httpConfig }: IApiConfig) {
    if (fireConfig) {

      return () => this.fetch(fireConfig);
    }
    const { method= 'GET', url } = httpConfig;
    let httpRequest = new HttpRequest(method, url, httpConfig);

    return () => this.http.request(httpRequest);
  }

  fetch(
    { scope, 
      childRef, 
      batchSize= 0, 
      lastKey, 
      queryFn= (key: string, batchSize: number, lastKey?: string) => (ref: Reference) => {
        if (lastKey) {
          return ref.startAt(null, lastKey).limitToFirst(batchSize+1);
        }
        return ref.limitToFirst(batchSize+1);
      } 
    }: IFireConfig): Observable<IRestaurants[]> {
    return this.afDb.list<IRestaurants>(scope, queryFn === null ? null : queryFn(childRef, batchSize, lastKey)).valueChanges();
  }
  
}

