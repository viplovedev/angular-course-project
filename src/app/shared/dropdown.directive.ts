import { Directive, ElementRef, Renderer2, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector:'[appDropdown]'
})
export class DropdownDirective{

    @HostBinding('class.open') isOpen: boolean = false;

    @HostListener('click') toggleOpen(){
        this.isOpen = !this.isOpen;
    }
}