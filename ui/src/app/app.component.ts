import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  DriverStanding,
  DriverStandingsService,
} from './services/driver-standings.service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  data: DriverStanding[] | undefined = undefined;

  constructor(private driverStandingsService: DriverStandingsService) {}

  ngOnInit() {
    this.driverStandingsService.getDriverStandingsForYear(2023).subscribe({
      next: (data) => {
        this.data = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
