import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';
@Component({
  selector: 'app-ka-splitted-input',
  templateUrl: './ka-splitted-input.component.html',
  styleUrls: ['./ka-splitted-input.component.scss'],
})
export class KaSplittedInputComponent implements OnInit {
  @Input() code?: string;
  @Output() valueUpdated = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.OTPInput();
    if (this.code) {
      this.setCurrentCode();
    }
  }

  OTPInput(): void {
    const inputs: any = document.querySelectorAll('#otp > *[id]');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('keydown', (event: any) => {
        if (ValidationUtils.isPasteEvent(event)) return;

        if (event.key === 'Backspace') {
          if (!inputs[i].value && i !== 0) inputs[i - 1].focus();
          else inputs[i].value = '';
          setTimeout(() => {
            this.valueUpdated.emit(this.getTotalValue());
          }, 10);
          return;
        }
        if (event.key === 'ArrowLeft' && i !== 0) {
          inputs[i - 1].focus();
          return;
        }
        if (event.key === 'ArrowRight' && i !== inputs.length - 1) {
          inputs[i + 1].focus();
          return;
        }
        const numberRegex = /^[0-9]$/;
        if (!numberRegex.test(event.key) || event.key === '.') {
          event.preventDefault();
          return;
        }

        if (inputs[i].value) inputs[i].value = '';

        if (i !== inputs.length - 1) {
          setTimeout(() => {
            inputs[i + 1].focus();
          }, 100);
        }
        setTimeout(() => {
          this.valueUpdated.emit(this.getTotalValue());
        }, 100);
      });
    }
  }

  private getTotalValue(): string {
    const inputs: any = document.querySelectorAll('#otp > *[id]');
    let totalValue = '';
    for (let i = 0; i < inputs.length; i++) {
      totalValue += inputs[i].value;
    }
    return totalValue;
  }

  private setCurrentCode(): void {
    const inputs: any = document.querySelectorAll('#otp > *[id]');
    const codeSplitted = this.code.split('');
    for (let i = 0; i < codeSplitted.length; i++) {
      inputs[i].value = codeSplitted[i];
    }
  }

  onPaste(event): void {
    // Prevent from printing invalid values
    event.preventDefault();
    // Get pasted values and split the string into individual characters
    const pastedValues: string[] = event.clipboardData.getData('Text').split('');
    // Get all input elements
    const inputs: any = document.querySelectorAll('#otp > *[id]');
    // Paste only the numbers of the array, starting from
    // the beginning of the first number encountered
    const numberRegex = /^[0-9]$/;
    let currentInputIndex = 0;
    for (let i in pastedValues) {
      // If all inputs are already populated, break the loop
      if (currentInputIndex >= inputs.length) {
        break;
      }
      // If the current character is a number, fill the input
      // at the current selected index
      const pastedValue = pastedValues[i];
      if (numberRegex.test(pastedValue)) {
        inputs[currentInputIndex].value = pastedValue;
        currentInputIndex++;
      }
    }
    if (currentInputIndex != 0) {
      inputs[currentInputIndex - 1].focus();
    }
    const totalValue = this.getTotalValue();
    this.valueUpdated.emit(totalValue);
  }
}
