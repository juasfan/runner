import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor() {}

  inputValidationClass(
    formGroup: FormGroup,
    formControlName: string
  ): { 'is-valid': boolean; 'is-invalid': boolean } {
    return {
      'is-valid': this.isValid(formGroup, formControlName),
      'is-invalid': this.isInvalid(formGroup, formControlName),
    };
  }

  isValid(formGroup: FormGroup, formControlName: string): boolean {
    const control = <AbstractControl>formGroup.get(formControlName);
    const isControlValid: boolean = control.valid && control.value;

    return control.dirty && isControlValid;
  }

  isInvalid(formGroup: FormGroup, formControlName: string): boolean {
    const control = <AbstractControl>formGroup.get(formControlName);

    return control.dirty && control.invalid;
  }

  markAllDirty(control: AbstractControl) {
    if (control.hasOwnProperty('controls')) {
      control.markAsDirty(); // mark group
      let ctrl = <any>control;
      for (let inner in ctrl.controls) {
        this.markAllDirty(ctrl.controls[inner] as AbstractControl);
      }
    } else {
      (<FormControl>control).markAsDirty();
    }
  }

  clearAllValidators(control: AbstractControl) {
    if (control.hasOwnProperty('controls')) {
      control.clearValidators();
      // control.updateValueAndValidity();
      let ctrl = <any>control;
      for (let inner in ctrl.controls) {
        this.clearAllValidators(ctrl.controls[inner] as AbstractControl);
      }
    } else {
      (<FormControl>control).clearValidators();
      // control.updateValueAndValidity();
    }
  }

  equalPassword(firstVal: string, secondVal: string): ValidatorFn {
    return (control: AbstractControl): { equalPassword: boolean } => {
      if (control.get(firstVal) === null || control.get(secondVal) === null) {
        return null;
      }
      if (control.get(firstVal).value !== control.get(secondVal).value) {
        return { equalPassword: true };
      } else {
        return null;
      }
    };
  }
}

export function numberOnly(control: AbstractControl): ValidationErrors | null {
  return /\D/.test(control.value)
    ? { numberOnly: { value: control.value } }
    : null;
}

export function amount(control: AbstractControl): ValidationErrors | null {
  if (control.value) {
    const amountWithoutMask = control.value.toString().replace(/,/g, '');
    return !/^[0-9]*(?:\.\d{1,2})?$/.test(amountWithoutMask)
      ? { amount: { value: amountWithoutMask } }
      : null;
  }
}

export function alphaNumeric(
  control: AbstractControl
): ValidationErrors | null {
  return !/^[a-zA-Z0-9]*$/i.test(control.value)
    ? { alphaNumeric: { value: control.value } }
    : null;
}

export function password(control: AbstractControl): ValidationErrors | null {
  return !/(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
    control.value
  )
    ? { password: { value: control.value } }
    : null;
}
