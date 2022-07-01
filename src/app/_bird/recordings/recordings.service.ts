import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRecording } from './xeno-canto.service';

@Injectable({
  providedIn: 'root'
})
export class RecordingsService {

  constructor(private readonly _http: HttpClient) { }

  public getRecordings(species: string): Observable<IRecording[]> {
    
    const params = new HttpParams()
      .set('species', species);

    return this._http.get<IRecording[]>('api/Recording', { params });
  }
}
