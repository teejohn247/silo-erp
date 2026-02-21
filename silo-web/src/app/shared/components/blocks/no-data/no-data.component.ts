import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss'
})
export class NoDataComponent {

  @Input() width:string = 'auto';
  @Input() height:string = '3rem';
  @Input() icon:string = 'folderOpen';
  @Input() imageUrl:string = '';
  @Input() iconSize:number = 80;
  @Input() message:string = 'No records exist';
  @Input() messageFontSize:string = '1rem';

}
