---
layout: default
title: FLSM Calculator
---

<div class="app" markdown="0">
  <h1>FLSM Calculator</h1>

  <form id="flsm-form">
    <div class="fields">
      <div class="field">
        <label for="flsm-address">Network address</label>
        <input
          id="flsm-address"
          name="address"
          type="text"
          autocomplete="off"
          spellcheck="false"
          inputmode="decimal"
          placeholder="192.168.10.0"
        />
      </div>
      <div class="field">
        <label for="flsm-mask">Subnet Mask or CIDR</label>
        <input
          id="flsm-mask"
          name="mask"
          type="text"
          autocomplete="off"
          spellcheck="false"
          placeholder="255.255.255.0 or /24"
        />
      </div>
      <div class="field">
        <label for="flsm-mode">Split by</label>
        <select id="flsm-mode" name="mode">
          <option value="subnets">Number of subnets</option>
          <option value="hosts">Hosts per subnet</option>
        </select>
      </div>
      <div class="field">
        <label for="flsm-value">Value</label>
        <input id="flsm-value" name="value" type="number" min="1" step="1" inputmode="numeric" />
      </div>
    </div>
  </form>

  <section id="flsm-output" aria-live="polite"></section>
</div>
