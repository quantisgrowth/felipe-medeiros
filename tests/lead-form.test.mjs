import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64');
const optionsUrl = moduleUrl(readFileSync(new URL('../src/lib/form-options.ts', import.meta.url), 'utf8'));
const options = await import(optionsUrl);
const stubUrl = moduleUrl('export function getSupabaseClient() { return globalThis.testSupabase; }');
const settingsUrl = moduleUrl(readFileSync(new URL('../src/lib/site-settings.ts', import.meta.url), 'utf8').replace('"./supabase"', JSON.stringify(stubUrl)).replace('"./form-options"', JSON.stringify(optionsUrl)));
const { submitLead, settingsToRow, DEFAULT_SITE_SETTINGS } = await import(settingsUrl);
const payload = { name:'Teste', company:'Empresa', role:'Gestor', whatsapp:'+5511999999999', email:'teste@example.com', segment:'Tecnologia', monthlyLeads:'Até 50', teamSize:'1 pessoa', mainChallenge:'Organizar a operação', tools:['CRM','WhatsApp'], source:'test',pageUrl:'https://example.com',utm:{utm_source:'test'} };

test('normaliza telefones e preserva DDI de países com o mesmo prefixo', () => {
  assert.equal(options.internationalPhone('BR','(11) 99999-9999'), '+5511999999999');
  assert.equal(options.internationalPhone('PT','912345678'), '+351912345678');
  assert.equal(options.internationalPhone('CA','4165551234'), '+14165551234');
  assert.equal(options.internationalPhone('BR','123'), undefined);
  assert.equal(options.internationalPhone('BR','5511999999999'), undefined);
  assert.equal(options.internationalPhone('XX','12345678'), undefined);
  assert.equal(options.internationalPhone('PT','123456789012345'), undefined);
});
test('normaliza opções do Manager e oferece padrões para configurações antigas', () => {
  assert.deepEqual(options.normalizeOptions([' CEO ', '', 'CEO', 'CFO'],[]), ['CEO','CFO']);
  assert.deepEqual(options.normalizeOptions(undefined,['Diretor']), ['Diretor']);
  const row = settingsToRow({...DEFAULT_SITE_SETTINGS,formRoles:[' Novo cargo ', 'Novo cargo']});
  assert.deepEqual(row.form_roles,['Novo cargo']);
});
test('salva ferramentas e retorna sem aguardar webhook lento; erro no banco nunca vira sucesso', async () => {
  const originalFetch = globalThis.fetch;
  let record, webhook;
  globalThis.testSupabase = {from: table => {assert.equal(table,'leads'); return {insert: async value => {record=value;return {error:null};}};}};
  globalThis.fetch = (url, init) => { webhook = {url,init}; return new Promise(()=>{}); };
  try {
    await submitLead(payload,'https://example.com/webhook');
    assert.deepEqual(record.tools,['CRM','WhatsApp']);
    assert.equal(record.whatsapp,'+5511999999999');
    assert.equal(webhook.init.keepalive,true);
    assert.deepEqual(JSON.parse(webhook.init.body).tools,payload.tools);
    webhook = undefined;
    globalThis.testSupabase = {from:()=>({insert:async()=>({error:new Error('database unavailable')})})};
    await assert.rejects(submitLead(payload,'https://example.com/webhook'), /database unavailable/);
    assert.equal(webhook,undefined);
  } finally { globalThis.fetch=originalFetch; delete globalThis.testSupabase; }
});

test('banco sem coluna tools recebe todas as respostas pelo campo existente, sem perder ferramentas', async () => {
  const records = [];
  globalThis.testSupabase = {from:()=>({insert:async record=>{
    records.push(record);
    return {error:records.length===1 ? {code:'PGRST204',message:"Could not find the 'tools' column of 'leads' in the schema cache"} : null};
  }})};
  try {
    await submitLead(payload,'');
    assert.equal(records.length,2);
    assert.equal('tools' in records[1],false);
    assert.equal(records[1].main_challenge,'Organizar a operação\n\nFerramentas atuais: CRM, WhatsApp');
    assert.equal(records[1].whatsapp,payload.whatsapp);
  } finally {delete globalThis.testSupabase;}
});
test('não repete gravação em erro de permissão ou indisponibilidade', async () => {
  let calls = 0;
  globalThis.testSupabase = {from:()=>({insert:async()=>{calls++;return {error:{code:'42501',message:'permission denied'}};}})};
  try {
    await assert.rejects(submitLead(payload,''));
    assert.equal(calls,1);
  } finally {delete globalThis.testSupabase;}
});
