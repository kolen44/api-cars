import {
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SparesService } from './spares.service';

@Controller('spares')
export class SparesController {
  constructor(private readonly sparesService: SparesService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './data', // Папка для сохранения файлов
        filename: (req, file, callback) => {
          const customFileName = 'file' + extname(file.originalname); // Установка желаемого имени файла
          callback(null, customFileName); // Вызов callback с новым именем файла
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new NotFoundException('No file uploaded or file stream is missing');
    }

    // Запись файла локально
    const filePath = './data/';
    fs.createWriteStream(filePath);

    // Дальнейшие действия с записанным файлом, например:
    const response = {
      message: 'Файл был успешно записан . Снизу данные файла:',
      originalName: file.originalname,
      fileName: file.filename, // Теперь имя файла будет измененным именем
    };

    return response;
  }
}
