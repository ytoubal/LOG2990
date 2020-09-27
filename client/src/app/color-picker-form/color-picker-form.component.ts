import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Color } from '@app/classes/color/color';

@Component({
    selector: 'app-color-picker-form',
    templateUrl: './color-picker-form.component.html',
    styleUrls: ['./color-picker-form.component.scss'],
})
export class ColorPickerFormComponent implements OnInit {
    @Input() color: Color = new Color(); // TODO remove initialization after tests are done
    @Output() confirm: EventEmitter<null> = new EventEmitter();
    redForm: FormControl;
    greenForm: FormControl;
    blueForm: FormControl;
    alphaForm: FormControl;

    ngOnInit(): void {
        this.redForm = new FormControl(this.color.getRedHex(), [Validators.pattern(/^[0-9A-F]{2}$/i), Validators.required]);
        this.greenForm = new FormControl(this.color.getGreenHex(), [Validators.pattern(/^[0-9A-F]{2}$/i), Validators.required]);
        this.blueForm = new FormControl(this.color.getBlueHex(), [Validators.pattern(/^[0-9A-F]{2}$/i), Validators.required]);
        this.alphaForm = new FormControl(this.color.opacity, [Validators.required]);
    }

    onRedChange(value: string): void {
        this.color.setRedHex(value);
        this.redForm.setValue(this.color.getRedHex());
        this.redForm.updateValueAndValidity();
    }

    onGreenChange(value: string): void {
        this.color.setGreenHex(value);
        this.greenForm.setValue(this.color.getGreenHex());
    }

    onBlueChange(value: string): void {
        this.color.setBlueHex(value);
        this.blueForm.setValue(this.color.getBlueHex());
    }

    changeOpacity(value: number): void {
        this.color.opacity = value;
        this.alphaForm.setValue(this.color.opacity);
    }

    closeDialog(): void {
        this.confirm.emit();
    }

    isColorInvalid(): boolean {
        return this.redForm.invalid || this.greenForm.invalid || this.blueForm.invalid || this.alphaForm.invalid;
    }
}