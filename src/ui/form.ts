/** DOM access for the FLSM form. Only this module knows the element ids. */

export interface FormElements {
  form: HTMLFormElement;
  addressInput: HTMLInputElement;
  maskInput: HTMLInputElement;
  cidrInput: HTMLInputElement;
  cidrValue: HTMLElement;
  subnetsInput: HTMLInputElement;
  hostsInput: HTMLInputElement;
  clearButton: HTMLButtonElement;
  output: HTMLElement;
}

export function getFormElements(): FormElements {
  const form = document.getElementById("flsm-form");
  const addressInput = document.getElementById("flsm-address");
  const maskInput = document.getElementById("flsm-mask");
  const cidrInput = document.getElementById("flsm-cidr");
  const cidrValue = document.getElementById("flsm-cidr-value");
  const subnetsInput = document.getElementById("flsm-subnets");
  const hostsInput = document.getElementById("flsm-hosts");
  const clearButton = document.getElementById("flsm-clear");
  const output = document.getElementById("flsm-output");
  if (
    !(form instanceof HTMLFormElement) ||
    !(addressInput instanceof HTMLInputElement) ||
    !(maskInput instanceof HTMLInputElement) ||
    !(cidrInput instanceof HTMLInputElement) ||
    !(cidrValue instanceof HTMLElement) ||
    !(subnetsInput instanceof HTMLInputElement) ||
    !(hostsInput instanceof HTMLInputElement) ||
    !(clearButton instanceof HTMLButtonElement) ||
    !(output instanceof HTMLElement)
  ) {
    throw new Error("FLSM form markup is missing one of the required element ids.");
  }
  return {
    form,
    addressInput,
    maskInput,
    cidrInput,
    cidrValue,
    subnetsInput,
    hostsInput,
    clearButton,
    output,
  };
}
