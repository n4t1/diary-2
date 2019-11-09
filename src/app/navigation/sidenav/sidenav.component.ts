import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  @Input() isOpen: boolean;

  constructor() { }

  ngOnInit() {
    this.sidenav.position = 'end';
    this.sidenav.mode = 'over';
  }

  sidenavOpen() {
    this.sidenav.toggle();
  }

}
