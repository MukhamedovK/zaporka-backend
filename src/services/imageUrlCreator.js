const imageUrlCreator = (filename, folder) => {
  return `/uploads/${folder}/${filename}`;
};

module.exports = imageUrlCreator;
