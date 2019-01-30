const { writeJson, getReadStream } = require('./file');
const fetch = require('node-fetch');
const FormData = require('form-data');

function buildQuery(data) {
  return Object.entries(data)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${key}=${v}`).join('&');
      }
      return `${key}=${value}`;
    })
    .join('&');
}

exports.PhraseAppClient = class PhraseAppClient {
  constructor(config, dir) {
    this.config = config;
    this.dir = dir;
    this.access_token = config.access_token;
    this.project_id = config.project_id;
  }

  fetch(url, { body, method = 'get' } = {}) {
    const action = `https://api.phraseapp.com/api/v2/${url}`;
    const headers = { Authorization: `token ${this.access_token}` };

    return fetch(action, {
      body,
      method,
      headers,
    });
  }

  async pull() {
    const locales = await this.getLocales();
    for (const locale of locales) {
      const localeData = await this.downloadLocale(locale.id);
      writeJson(this.dir, `${locale.name}.json`, localeData);
    }
  }

  getLocales() {
    return this.fetch(`projects/${this.project_id}/locales`).then(r => r.json());
  }

  downloadLocale(localeId) {
    return this.fetch(
      `projects/${this.project_id}/locales/${localeId}/download?${buildQuery({
        file_format: 'react_simple_json',
      })}`
    ).then(r => r.json());
  }

  uploadFile({ file: filename, params: { locale_id, file_format } }) {
    const form = new FormData();
    form.append('file', getReadStream(this.dir, filename));
    form.append('filename', filename);
    form.append('locale_id', locale_id);
    form.append('file_format', file_format);
    return this.fetch(`projects/${this.project_id}/uploads`, {
      method: 'post',
      body: form,
    });
  }

  async push() {
    const configs = this.config.push.sources;
    for (const config of this.config.push.sources) {
      await this.uploadFile(config);
    }
  }
};
