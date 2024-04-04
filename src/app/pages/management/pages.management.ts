import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { COMPANIES } from 'src/utils/data';

@Component({
  selector: 'page-management',
  templateUrl: './pages.management.html',
  styleUrls: ['./pages.management.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PageManagement implements OnInit {
  genTab: number;
  companies = COMPANIES;
  @ViewChildren('childTabs') childTabs: QueryList<MatTabGroup>;

  styleButton: Object = {
    marginLeft: "auto", 
    display: "flex"
  }

  ngOnInit() {
    this.genTab = 0;
  }

  onChangeTab(event: any) {
    this.genTab = event.index;

    this.childTabs.forEach((childTab) => {
      childTab.realignInkBar();
    });
  }

  openModal(tab: number) {
    if(tab === 1) {
      console.log("TESTE")
    }
  }
}
