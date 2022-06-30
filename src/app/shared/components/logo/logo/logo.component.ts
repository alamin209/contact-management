import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit {
  src = environment.logo;

  @Input() customStyle: string = '';

  constructor() {}

  ngOnInit(): void {}
}
