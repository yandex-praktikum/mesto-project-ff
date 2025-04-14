const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ['> 1%', 'last 2 versions'] // Кастомизируем список браузеров
    }),
    cssnano({
      preset: ['default', {
        discardComments: {
          removeAll: true // Удаляем все комментарии
        }
      }]
    })
  ]
};