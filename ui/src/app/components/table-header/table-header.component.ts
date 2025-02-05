import { Component, Input } from '@angular/core';
import { ChevronComponent } from '../chevron/chevron.component';
import { Output, EventEmitter } from '@angular/core';
import { OrderableParameter } from '../../app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-header',
  imports: [ChevronComponent, CommonModule],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss',
})
export class TableHeaderComponent {
  @Input()
  title!: string;

  @Input()
  value: OrderableParameter | undefined;

  @Input()
  currentValue: string | undefined;

  @Input()
  currentOrder: string | undefined;

  @Output()
  clicked = new EventEmitter();

  chevronColor: string = 'black';

  ngOnChanges() {
    this.chevronColor =
      this.value &&
      this.currentValue === this.value &&
      this.currentOrder !== 'None'
        ? 'black'
        : '#ddd';
  }
}
