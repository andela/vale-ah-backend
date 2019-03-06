
const Helper = {
  async uploadImages(files) {
    let imagePath = '';
    const filePaths = files.secure_url;
    imagePath = filePaths;
    // console.log(imagePath);
    return new Promise(async (resolve, reject) => {
      if (imagePath) {
        return resolve(imagePath);
      }
      return reject(Error('Unable to upload media item'));
    });
  }
};
export default Helper;
