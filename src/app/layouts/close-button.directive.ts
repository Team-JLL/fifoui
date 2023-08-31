import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[closeButton]'
})
export class CloseButtonDirective implements OnInit {
  constructor(private el: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.el.nativeElement.innerText = 'X';
    this.renderer.addClass(this.el.nativeElement, 'btn');
    this.renderer.addClass(this.el.nativeElement, 'btn-danger');
    this.renderer.addClass(this.el.nativeElement, 'btn-xs');
    this.renderer.setStyle(this.el.nativeElement.parentElement, 'text-align', 'end');
  }
}
