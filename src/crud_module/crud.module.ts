import { Module } from '@nestjs/common';
import { CrudController } from './controller/crud/crud.controller';
import { CrudService } from './services/crud/crud.service';
import { CsvModule } from 'nest-csv-parser'
import { User } from './data_transfer_object/user_dto';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [CsvModule,],
    controllers: [CrudController],
    providers: [CrudService, User, ConfigService],        
})
export class CrudModule { }
