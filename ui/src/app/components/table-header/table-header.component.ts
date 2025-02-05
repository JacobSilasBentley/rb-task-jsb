import { Component, Input } from '@angular/core';
import { ChevronComponent } from '../chevron/chevron.component';
import { Output, EventEmitter } from '@angular/core';
import { OrderableParameter } from '../../app.component';

@Component({
  selector: 'app-table-header',
  imports: [ChevronComponent],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss',
})
export class TableHeaderComponent {
  @Input()
  value: OrderableParameter | undefined;

  @Input()
  currentValue: string | undefined;

  @Input()
  currentOrder: string | undefined;

  @Output()
  clicked = new EventEmitter();
}
