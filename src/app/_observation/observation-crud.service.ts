import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IObservation } from './i-observation.dto';
import { ICreateObservation } from './observation-create/i-create-observation.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ObservationCrudService {

  constructor(private readonly _http: HttpClient) { }

  public addObservation(model: ICreateObservation): Observable<IObservation> {
    return this._http.post<IObservation>('api/Observation/CreateObservation', model, httpOptions)
      .pipe(tap(() => { this._onObservationsChanged(); }));
  }




  private _onObservationsChanged(): void {
    // this._service.getData();
    // this._topService.getData();
  }
}
