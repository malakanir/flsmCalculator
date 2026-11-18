/** DOM access for the FLSM form. Only this module knows the element ids. */

export interface FormElements {
  form: HTMLFormElement;
  addressInput: HTMLInputElement;
  maskInput: HTMLInputElement;
  modeSelect: HTMLSelectElement;
  valueInput: HTMLInputElement;
  output: HTMLElement;
}

export function getFormElements(): FormElements {
  const form = document.getElementById("flsm-form");
  const addressInput = document.getElementById("flsm-address");
  const maskInput = document.getElementById("flsm-mask");
  const modeSelect = document.getElementById("flsm-mode");
  const valueInput = document.getElementById("flsm-value");
  const output = document.getElementById("flsm-output");
  if (
    !(form instanceof HTMLFormElement) ||
    !(addressInput instanceof HTMLInputElement) ||
    !(maskInput instanceof HTMLInputElement) ||
    !(modeSelect instanceof HTMLSelectElement) ||
    !(valueInput instanceof HTMLInputElement) ||
    !(output instanceof HTMLElement)
  ) {
    throw new Error("FLSM form markup is missing one of the required element ids.");
  }
  return { form, addressInput, maskInput, modeSelect, valueInput, output };
}
