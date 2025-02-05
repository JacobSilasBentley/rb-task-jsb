import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';

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
      `https://localhost:7158/driver-standings?year=${year}`
    );
  }
}
