// @ts-ignore
import type { Editor } from 'grapesjs';
// @ts-ignore
import juice  from 'juice'
import { RequiredPluginOptions } from '..';
import { mjmlConvert } from '../components/utils';
import openExportMjml from './openExportMjml';
import openImportMjml from './openImportMjml';

export const cmdDeviceDesktop = 'set-device-desktop';
export const cmdDeviceTablet = 'set-device-tablet';
export const cmdDeviceMobile = 'set-device-mobile';
export const cmdImportMjml = 'mjml-import';
export const cmdClearMjml = 'mjml-clear';
export const cmdExportHtml = 'html-export';
export const cmdExportMjml = 'mjml-export';
export const cmdSearchPholder = 'mjml-pholder';
export const cmdGetMjml = 'mjml-code';
export const cmdGetMjmlToHtml = 'mjml-code-to-html';
export const cmdGetMjmlToHtmlInline = 'mjml-code-to-html-inline';

export default (editor: Editor, opts: RequiredPluginOptions) => {
  const { Commands } = editor;
  const cmdOpenExport = opts.overwriteExport ? 'export-template' : cmdExportHtml;

  Commands.add(cmdGetMjml, () => {
      return `${opts.preMjml}${editor.getHtml().trim()}${opts.postMjml}`;
  });

  Commands.add(cmdClearMjml, () => {
    const cmp = editor.Components;
    cmp.clear()
    editor.clearDirtyCount()
    editor.addComponents(`<mjml>
                                    <mj-body>
                                    </mj-body>
                                  </mjml>`)
    });

  Commands.add(cmdExportHtml, (ed, _, opt) => {
    const mjml = Commands.run(cmdGetMjml);
    const standHtml=mjmlConvert(mjml, opts.fonts, opt);
    const resHtml=juice(standHtml.html)
    let fileName = 'html文件';
    fileName = fileName + '_'+(new Date()).valueOf()
    const uri = 'data:application/vnd.ms-html;base64,';
    // 下载
    const template = resHtml;
    const downloadLink = document.createElement("a");
    // 输出base64编码
    const base64 = (s:any) => window.btoa(unescape(encodeURIComponent(s)));
    downloadLink.href = uri + base64(template);
    downloadLink.download = fileName + '.html';
    downloadLink.target = '_blank';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });

  Commands.add(cmdExportMjml, (ed, _, opt) => {
    const mjml = Commands.run(cmdGetMjml);
    let fileName = 'mjml文件';
    fileName = fileName + '_'+(new Date()).valueOf()
    const uri = 'data:application/vnd.ms-html;base64,';
    // 下载
    const template = juice(mjml);
    const downloadLink = document.createElement("a");
    // 输出base64编码
    const base64 = (s:any) => window.btoa(unescape(encodeURIComponent(s)));
    downloadLink.href = uri + base64(template);
    downloadLink.download = fileName + '.mjml';
    downloadLink.target = '_blank';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });

  Commands.add(cmdGetMjmlToHtmlInline, (ed, _, opt) => {
    const mjml = Commands.run(cmdGetMjml);
    const standHtml=mjmlConvert(mjml, opts.fonts, opt);
    return juice(standHtml.html)
  });

  Commands.add(cmdSearchPholder, (ed, _, opt) => {
    const mjml = Commands.run(cmdGetMjml);
    const patter=/<body[^>]*>([\s\S]+?)<\/body>/i
    const matchStr=mjml.match(patter)
    console.log('html',matchStr)
    return matchStr
  });

  Commands.add(cmdGetMjmlToHtml, (ed, _, opt) => {
      const mjml = Commands.run(cmdGetMjml);
      return mjmlConvert(mjml, opts.fonts, opt);
  });

  openExportMjml(editor, opts, cmdOpenExport);
  openImportMjml(editor, opts, cmdImportMjml);

  // Device commands
  Commands.add(cmdDeviceDesktop, {
    run: ed => ed.setDevice('Desktop'),
    stop: () => {},
  });
  Commands.add(cmdDeviceTablet, {
    run: ed => ed.setDevice('Tablet'),
    stop: () => {},
  });
  Commands.add(cmdDeviceMobile, {
    run: ed => ed.setDevice('Mobile portrait'),
    stop: () => {},
  });

};
