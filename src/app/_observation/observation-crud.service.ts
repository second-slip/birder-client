import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateObservation } from './observation-create/i-create-observation.dto';
import { IUpdateObservation } from './observation-update/i-update-observation.dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ObservationCrudService {

  constructor(private readonly _http: HttpClient) { }

  public getObservation(id: string): Observable<IUpdateObservation> {
    const options =
      { params: new HttpParams().append('id', id.toString()) };

    return this._http.get<IUpdateObservation>('api/observationread/update', options);
  }

  public addObservation(model: ICreateObservation): Observable<{ observationId: string }> {
    return this._http.post<{ observationId: string }>('api/observation/create', model, httpOptions);
  }

  public updateObservation(id: string, viewModel: IUpdateObservation): Observable<{ observationId: string }> {
    const options =
      { params: new HttpParams().set('id', id.toString()) };

    return this._http.put<{ observationId: string }>('api/observation/update', viewModel, options);
  }

  // todo: return same object as above
  public deleteObservation(id: number): Observable<number> {
    const options = id ? { params: new HttpParams().set('id', id.toString()) } : {};

    return this._http.delete<number>('api/observation/delete', options);
  }
}