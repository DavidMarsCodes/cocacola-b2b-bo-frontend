import * as _ from 'lodash';

export class ValidationUtils {
  constructor() {}

  static isPasteEvent(ev): boolean {
    const key = ev.which || ev.keyCode;
    const ctrl = ev.ctrlKey ? ev.ctrlKey : key === 17 ? true : false;
    if (key == 86 && ctrl) return true;
    else if (key == 67 && ctrl) return true;
    return false;
  }

  static validRegexOnPaste(regex, event): void {
    const pastedText = event?.clipboardData?.getData('Text');
    if (!pastedText) event.preventDefault();
    if (!regex.test(pastedText)) event.preventDefault();
  }
}
