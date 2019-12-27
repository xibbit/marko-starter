'use strict';

module.exports = {
  name: 'print-configuration',
  run: function (project) {
    let logger = project.getLogger();
    let colorsEnabled = project.getColors();
    let rawConfig = project.clean();

    let keyValuePairs = [];

    project.constructor.forEachProperty((property) => {
      if (property.configurable !== false) {
        let key = property.getKey();
        let value = rawConfig[key];
        if (value == null) {
          value = '(not set)';
          if (colorsEnabled) {
            value = value.grey;
          }
        } else {
          if (typeof value === 'object') {
            let fnstr = '';
            for (const [k, v] of Object.entries(value)) {
              if (typeof v == 'function') {
                if (fnstr) {
                  fnstr += ',\n  ';
                }
                fnstr += `  "${k}": ${v}`;
              }
            }
            if (fnstr) {
              fnstr += '\n';
            }
            value = JSON.stringify(value, null, '  ').split('\n').map((line) => {
              return '  ' + line;
            }).join('\n');
            if (fnstr) {
              if (value.length <= 4) {
                fnstr = '\n  ' + fnstr;
              } else {
                value = value.substring(0, value.length-4) + ',' + value.substring(value.length-4);
              }
              fnstr = fnstr + '  ';
            }
            value = value.substring(0, value.length-1) + fnstr + '}';
          }
          if (colorsEnabled) {
            value = value.toString().cyan;
          }
        }

        if (colorsEnabled) {
          key = key.yellow;
        }

        keyValuePairs.push([key, value]);
      }
    });

    logger.info('\nCONFIGURATION:\n' + keyValuePairs.map(function (pair) {
      return '  ' + pair[0] + ': ' + pair[1];
    }).join('\n'));
  }
};
