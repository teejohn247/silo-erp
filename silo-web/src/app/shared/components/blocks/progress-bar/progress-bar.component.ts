// Angular modules
import { Component } from '@angular/core';
import { Input }     from '@angular/core';
import { OnInit }    from '@angular/core';

@Component({
  selector    : 'init-progress-bar',
  templateUrl : './progress-bar.component.html',
  styleUrls   : ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit
{
  @Input() withLabel : boolean = false;

  constructor() { }

  public ngOnInit() : void
  {
  }

}
