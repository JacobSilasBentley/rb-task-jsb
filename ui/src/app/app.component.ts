import {
  Component,
  computed,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  DriverStanding,
  DriverStandingsService,
} from './services/driver-standings.service';
import { CommonModule } from '@angular/common';

// Sort By
// Position
// Driver Name
// Team Name

// Filter By:
// Team Name
// Driver Country

const currentYear = new Date().getFullYear();
const yearFirstF1Season = 1950;
const defaultYear = currentYear - 1;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  data: WritableSignal<DriverStanding[] | undefined> = signal(undefined);
  teamFilter = signal<string>('');
  countryFilter = signal<string>('');
  selectedYear = signal(defaultYear);

  filteredData = computed(() => {
    if (!this.data()) return [];
    return this.data()!
      .filter(
        (x) =>
          !this.countryFilter()?.length ||
          x.driverCountryCode == this.countryFilter()
      )
      .filter(
        (x) =>
          !this.teamFilter()?.length || x.seasonTeamName == this.teamFilter()
      );
  });
  availableTeams = computed(() => {
    if (!this.data()) return [];
    return [...new Set(this.data()!.map((x) => x.seasonTeamName))].sort();
  });
  availableCountries = computed(() => {
    if (!this.data()) return [];
    return [...new Set(this.data()!.map((x) => x.driverCountryCode))].sort();
  });
  availableYears = Array.from(
    { length: currentYear - yearFirstF1Season + 1 },
    (_, i) => yearFirstF1Season + i
  ).reverse();

  constructor(private driverStandingsService: DriverStandingsService) {
    effect(() => {
      this.updateDriverStandingsData();
    });
  }

  updateDriverStandingsData() {
    this.countryFilter.set('');
    this.teamFilter.set('');
    this.driverStandingsService
      .getDriverStandingsForYear(this.selectedYear())
      .subscribe({
        next: (data) => {
          this.data.set(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  updateSelectedYear(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedYear.set(+input.value);
  }

  updateTeamFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.teamFilter.set(input.value);
  }

  updateCountryFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.countryFilter.set(input.value);
  }
}
