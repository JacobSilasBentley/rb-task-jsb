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
import { TableHeaderComponent } from './components/table-header/table-header.component';

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

export type OrderableParameter = 'position' | 'driverName' | 'teamName';
export type OrderingOptions = 'Ascending' | 'Descending' | 'None';

type Ordering = {
  order: OrderingOptions;
  parameter: OrderableParameter | undefined;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TableHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  data: WritableSignal<DriverStanding[] | undefined> = signal(undefined);
  teamFilter = signal<string>('');
  countryFilter = signal<string>('');
  selectedYear = signal(defaultYear);
  ordering = signal<Ordering>({ order: 'None', parameter: undefined });

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
  filteredAndOrderedData = computed(() => {
    if (
      this.ordering().order === 'None' ||
      this.ordering().parameter === undefined
    ) {
      return this.filteredData();
    }
    debugger;
    let getter: (a: DriverStanding, b: DriverStanding) => any = (
      a: DriverStanding,
      b: DriverStanding
    ) => a.position - b.position;
    switch (this.ordering().parameter) {
      case 'position':
        getter = (a: DriverStanding, b: DriverStanding) =>
          a.position - b.position;
        break;
      case 'driverName':
        getter = (a: DriverStanding, b: DriverStanding) =>
          a.driverName.localeCompare(b.driverName);
        break;
      case 'teamName':
        getter = (a: DriverStanding, b: DriverStanding) =>
          a.seasonTeamName.localeCompare(b.seasonTeamName);
        break;
    }

    const sorted = [...this.filteredData()].sort(getter);
    return this.ordering().order === 'Descending' ? sorted.reverse() : sorted;
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

  updateOrdering(parameter: OrderableParameter) {
    this.ordering.update((o) => {
      const orderProgression: OrderingOptions[] = [
        'Ascending',
        'Descending',
        'None',
      ];
      if (o.parameter == parameter) {
        const currentIndex = orderProgression.indexOf(o.order);
        const next =
          orderProgression[(currentIndex + 1) % orderProgression.length];
        return { ...o, order: next };
      } else {
        return { parameter, order: 'Ascending' };
      }
    });
  }
}
