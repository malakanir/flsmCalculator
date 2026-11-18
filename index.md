---
layout: default
title: FLSM Calculator
---

<div class="app" markdown="0">
  <h1>FLSM Calculator</h1>
  <p class="lead">
    Divide a base IPv4 network into identical subnets (Fixed Length Subnet Mask). Enter the
    base network, then either the number of subnets you need or the usable hosts per subnet.
  </p>

  <form id="flsm-form">
    <div class="fields">
      <div class="field">
        <label for="flsm-address">IP Address</label>
        <input
          id="flsm-address"
          name="address"
          type="text"
          autocomplete="off"
          spellcheck="false"
          inputmode="decimal"
          placeholder="192.168.1.0"
        />
      </div>
      <div class="field">
        <label for="flsm-mask">Subnet Mask</label>
        <input
          id="flsm-mask"
          name="mask"
          type="text"
          autocomplete="off"
          spellcheck="false"
          placeholder="255.255.255.0 or /24"
        />
      </div>
      <div class="field wide">
        <label for="flsm-cidr">CIDR: <span id="flsm-cidr-value">/24</span></label>
        <input id="flsm-cidr" name="cidr" type="range" min="0" max="32" step="1" value="24" />
      </div>
      <div class="field">
        <label for="flsm-subnets">No. of Subnets</label>
        <input
          id="flsm-subnets"
          name="subnets"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          placeholder="e.g. 4"
        />
      </div>
      <div class="field">
        <label for="flsm-hosts">Hosts per Subnet</label>
        <input
          id="flsm-hosts"
          name="hosts"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          placeholder="e.g. 62"
        />
      </div>
    </div>

    <div class="actions">
      <button type="submit" id="flsm-calculate">Calculate</button>
      <button type="button" id="flsm-clear">Clear All</button>
    </div>
  </form>

  <section id="flsm-output" aria-live="polite"></section>

  <section class="guide">
    <h2>How to Use the FLSM Calculator</h2>
    <ol>
      <li>Enter the base network: an IP address and a subnet mask or CIDR prefix.</li>
      <li>Enter either <strong>No. of Subnets</strong> or <strong>Hosts per Subnet</strong>, not both.</li>
      <li>Press <strong>Calculate</strong>. Results also update as you type.</li>
      <li>Review the subnets. Any leftover space appears in the free table as blocks of the same size.</li>
    </ol>

    <h2>Example Split</h2>
    <p>
      Splitting <code>192.168.1.0/24</code> into four subnets borrows two bits, giving four
      <code>/26</code> subnets. Each has 62 usable hosts and 64 total addresses, with no free blocks left.
    </p>
  </section>
</div>
