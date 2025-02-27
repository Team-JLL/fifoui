import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.css']
})
export class AdvancedFilterComponent {
  @Input() filterFields: any[] = []; // Accepts different filter fields
  @Output() applyFilter = new EventEmitter<any>(); // Emit applied filters
  @Output() resetFilter = new EventEmitter<void>(); // Emit when reset is clicked

  filterForm!: FormGroup ;
  searchFilter = new FormControl('');

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({})

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const formControls: { [key: string]: any } = {}; // Explicitly define type
    this.filterFields.forEach(field => {
      formControls[field.key] = [""];
    });
    this.filterForm = this.fb.group(formControls);
  }

  applyFilters() {
    this.applyFilter.emit(this.filterForm.value);
  }

  resetFilters() {
    this.filterForm.reset();
    this.resetFilter.emit();
  }
}
