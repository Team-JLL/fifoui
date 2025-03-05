import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
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
  filteredOptions: { [key: string]: any[] } = {};

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({})

  }

  ngOnInit() {
    this.createForm();
    this.setupSearchFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterFields'] && changes['filterFields'].currentValue) {
      this.createForm(); // Recreate the form whenever filterFields changes
      this.setupSearchFilters()
    }
  }

  createForm() {
    const formControls: { [key: string]: any } = {}; // Explicitly define type
    this.filterFields.forEach(field => {
      formControls[field.key] = [""];
    });
    this.filterForm = this.fb.group(formControls);
  }

  setupSearchFilters() {
    this.filterFields.forEach(field => {
      if (field.type === 'dropdown') {
        this.filteredOptions[field.key] = field.options;

        this.searchFilter.valueChanges.subscribe(searchText => {
          this.filteredOptions[field.key] = field.options.filter((option: { label: string; value: any }) =>
            option.label.toLowerCase().includes(searchText?.toLowerCase() || '')
          );
        });
      }
    });
  }

  applyFilters() {
    this.applyFilter.emit(this.filterForm.value);
  }

  resetFilters() {
    this.filterForm.reset();
    this.resetFilter.emit();
  }
}
