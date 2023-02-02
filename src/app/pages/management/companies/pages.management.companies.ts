import { Component } from '@angular/core';
import { COMPANIES } from 'src/utils/data';

@Component({
  selector: 'management-companies',
  templateUrl: './pages.management.companies.html',
  styleUrls: ['./pages.management.companies.css'],
})
export class ManagementCompaniesComponent {
  companies = COMPANIES;
}
