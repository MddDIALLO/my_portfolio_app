import { Request, Response } from 'express';
const fs = require('fs');

const storeImage = (req: Request, res: Response) => {
  const { imageData, uploadPath, fileName } = req.body;
  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
  
  fs.writeFile(`../data/${uploadPath}/${fileName}`, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      res.status(500).send('Error saving image');
    } else {
      res.status(200).send('Image saved successfully');
    }
  });
};

export default { storeImage };