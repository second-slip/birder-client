import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRecording } from './i-recording.dto';

@Injectable({
  providedIn: 'root'
})
export class RecordingsService {

  constructor(private readonly _http: HttpClient) { }

  public getRecordings(species: string): Observable<IRecording[]> {
    const options = species ? { params: new HttpParams().set('species', species) } : {};

    return this._http.get<Array<IRecording>>('api/Recording', options);
  }
}