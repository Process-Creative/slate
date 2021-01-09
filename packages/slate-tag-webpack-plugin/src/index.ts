const SETTINGS_SCHEMA_PATH = '../config/settings_schema.json';
const THEME_INFO_PANEL = 'theme_info';

const  findThemeInfoPanel = (schema:any) => {
  if (!Array.isArray(schema)) {
    return null;
  }

  return schema.find((panel) => {
    return typeof panel === 'object' && panel.name === THEME_INFO_PANEL;
  });
}

export class SlateTagWebpackPlugin {
  public version:string;

  constructor(version:string) {
    this.version = version;
  }

  apply(compiler:any) {
    compiler.hooks.emit.tap('Slate Tag Plugin', (compilation) => {
      const asset = compilation.assets[SETTINGS_SCHEMA_PATH].source();
      const schema = JSON.parse(asset);
  
      const themeInfo = findThemeInfoPanel(schema);
  
      if (themeInfo) {
        themeInfo.theme_packaged_with = `@process-creative/slate-tools@${this.version}`;
      }
  
      const jsonString = JSON.stringify(schema);
  
      compilation.assets[SETTINGS_SCHEMA_PATH] = {
        source() {
          return jsonString;
        },
        size() {
          return jsonString.length;
        },
      };
    });
  }
}