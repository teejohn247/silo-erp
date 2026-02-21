import { Component, Input, OnInit } from '@angular/core';
import { Icons } from '../../../constants/icons';
import { DomSanitizer } from '@angular/platform-browser';

type IconName = keyof typeof Icons;

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent implements OnInit {
  icons = Icons;
  @Input() iconName!: IconName;
  @Input() iconStrokeWidth: number = 1.5;
  @Input() iconWidth?:number = 24;
  @Input() iconHeight?:number = 24;

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  public transformSvg(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
