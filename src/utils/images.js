function importAll(r) {
  const images = {};
  r.keys().forEach((key) => {
    const fileName = key.replace('./', '');
    images[fileName] = r(key);
  });
  return images;
}

export const images = importAll(
  require.context('../images', false, /\.(png|jpe?g|svg)$/)
);

