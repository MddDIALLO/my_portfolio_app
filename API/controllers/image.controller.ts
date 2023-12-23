import { Request, Response } from 'express';
import * as path from 'path';
const fs = require('fs');

const storeImage = (req: Request, res: Response) => {
  const { imageData, uploadPath, fileName } = req.body;
  const base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  const filePath = path.join(__dirname, '..', 'public', uploadPath, fileName);

  const directoryPath = path.dirname(filePath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving image:', err);
      res.status(500).send('Error saving image');
    } else {
      res.status(200).send({
        message: 'Image saved successfully',
        filePath: filePath
    });
    }
  });
};

export default { storeImage };