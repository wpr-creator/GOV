// Isolated tests: no network requests or spreadsheet writes.
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const start = source.indexOf('document.getElementById("exit-form").addEventListener("submit",');
const end = source.indexOf('window.setInterval(renderAgendaDate', start);
async function test(reply, expected, cleared) {
  let handler;
  const button = {};
  const elements = {
    'exit-form': { addEventListener: (_, fn) => handler = fn },
    'exit-period': { value: '1B' }, 'exit-student': { value: 'TEST ONLY' },
    'exit-response': { value: 'A test answer never sent.' }, 'exit-status': {}
  };
  vm.runInNewContext(source.slice(start, end), {
    document: { getElementById: id => elements[id] },
    siteContent: { exitEndpoint: 'https://invalid.example', exitQuestion: 'Test question' },
    validateExitTicket: () => {}, fetch: reply
  });
  await handler({ preventDefault() {}, currentTarget: { querySelector: () => button } });
  assert(elements['exit-status'].textContent.includes(expected));
  assert.equal(elements['exit-response'].value === '', cleared);
  assert.equal(button.textContent, 'SUBMIT EXIT TICKET');
}
(async () => {
  await test(async () => ({ ok: true, json: async () => ({result:'success'}) }), 'SUBMITTED TO MR. ROGERS', true);
  await test(async () => ({ ok: true, json: async () => ({result:'error'}) }), 'SAVING COULD NOT BE CONFIRMED', false);
  await test(async () => { throw new Error('Network/CORS failure'); }, 'SAVING COULD NOT BE CONFIRMED', false);
  await test(async () => ({ ok: true, json: async () => { throw new Error('Invalid response'); } }), 'SAVING COULD NOT BE CONFIRMED', false);
  assert(source.includes('exitForm.closest(".exit-card").hidden = !exitQuestion'));
  const visibilityStart = source.indexOf('    const exitQuestion =', source.indexOf('function renderSiteContent()'));
  const visibilityEnd = source.indexOf('    const exitStatus', visibilityStart);
  for (const question of ['', 'Open question']) {
    const card = {}, form = { closest: () => card }, text = {};
    vm.runInNewContext(source.slice(visibilityStart, visibilityEnd), {
      siteContent: { exitQuestion: question, exitEndpoint: 'unused' },
      document: { getElementById: id => id === 'exit-form' ? form : text }
    });
    assert.equal(card.hidden, !question);
    assert.equal(form.hidden, !question);
  }
  console.log('Submission tests passed: confirmed save, server error, network failure, unreadable reply; no external submissions.');
})().catch(error => { console.error(error); process.exitCode = 1; });
