import { Module } from '@nestjs/common';
import { CrudModule } from './crud_module/crud.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configration from './config/config';
import * as fs from 'fs';
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
          let header = {
            "rows": [
              [
                "Name",
                "Gender",
                "Phone",
                "Email",                
                "Nationality",
                "Date_of_birth",
                "Education_background",
                "Preferred_mode_of_contact"
              ],                    
            ],
          };
          const stringToReplaceComas = '!!!!';
          header.rows.map((singleRow) => {
            singleRow.map((value, index) => {
              singleRow[index] = value.replace(/,/g, stringToReplaceComas);
            })
          })
          let csv = `"${header.rows.join('"\r\n"').replace(/,/g, '","')}"`;          
          csv = csv.replace(new RegExp(`${stringToReplaceComas}`, 'g'), ',');
          fs.writeFile(`${databasePath}/data.csv`, csv, 'utf-8', () => {
            console.log('Database created');
          })
        })
      } else {
        console.log('Database file exist');
      }
    })
  }
}
