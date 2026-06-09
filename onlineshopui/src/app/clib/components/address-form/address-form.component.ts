import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressDto } from '../../../core/types/dtos/location.dto';

@Component({
    selector: 'app-address-form',
    imports: [ReactiveFormsModule, NgClass],
    templateUrl: './address-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent {
    initialAddress = input<AddressDto | null>(null);
    addressChange = output<AddressDto | null>();

    readonly form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            country: ['', [Validators.required, Validators.maxLength(100)]],
            city: ['', [Validators.required, Validators.maxLength(100)]],
            county: ['', [Validators.required, Validators.maxLength(100)]],
            streetAddress: ['', [Validators.required, Validators.maxLength(255)]]
        });

        // Emit address changes
        this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
            if (this.form.valid) {
                this.addressChange.emit(this.form.value as AddressDto);
            } else {
                this.addressChange.emit(null);
            }
        });

        // Initialize form with initial address if provided
        effect(() => {
            const address = this.initialAddress();
            if (address) {
                this.form.patchValue(address, { emitEvent: false });
            }
        });
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return '';
        }

        if (control.errors['required']) {
            return `${this.getFieldLabel(fieldName)} is required`;
        }
        if (control.errors['maxlength']) {
            const maxLength = control.errors['maxlength'].requiredLength;
            return `${this.getFieldLabel(fieldName)} must not exceed ${maxLength} characters`;
        }
        return '';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: Record<string, string> = {
            country: 'Country',
            city: 'City',
            county: 'County',
            streetAddress: 'Street address'
        };
        return labels[fieldName] || fieldName;
    }

    hasError(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }
}
