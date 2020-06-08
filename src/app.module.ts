import { Module } from '@nestjs/common';
import { CrudModule } from './crud_module/crud.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configration from './config/config';
import * as fs from 'fs';
var json2csv = require('json2csv').parse;
var newLine = "\r\n";

@Module({
  imports: [CrudModule, ConfigModule.forRoot({
    load: [configration]
  })]
})
export class AppModule {
  constructor(public configService: ConfigService) {
    /**
     * default csv file created when its not available at start
     */
    const databasePath = configService.get<string>('database');
    fs.exists(databasePath, (isExist) => {
      if (!isExist) {
        fs.mkdir(databasePath, '0777', (isFolderCreated) => {
          let fields: any = [
            "Name",
            "Gender",
            "Phone",
            "Email",
            "Address",
            "Nationality",
            "Date_of_birth",
            "Education_background",
            "Preferred_mode_of_contact"
          ];
          fs.stat(databasePath + '/file.csv', function (err, stat) {
            if (err == null) {
              console.log('File exists');
            } else {
              //write the headers and newline
              console.log('New file, just writing headers');
              fields = (fields + newLine);

              fs.writeFile(databasePath + '/file.csv', fields, function (err) {
                if (err) throw err;
                console.log('file saved');
              });
            }
          });
        });
      } else {
        console.log('folder file exist');
      }
    });    
  }
}
