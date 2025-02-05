import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type DriverStanding = {
  driverUUID: string;
  driverName: string;
  driverCountryCode: string;
  seasonTeamName: string;
  seasonPoints: number;
  position: number;
};

@Injectable({
  providedIn: 'root',
})
export class DriverStandingsService {
  constructor(private httpClient: HttpClient) {}

  getDriverStandingsForYear(year: number): Observable<DriverStanding[]> {
    return this.httpClient.get<DriverStanding[]>(
      `${environment.baseDriverStandingsApi}/driver-standings?year=${year}`
    );
  }
}
