import { Injectable } from '@nestjs/common';
import { User } from 'src/crud_module/data_transfer_object/user_dto';
import { CsvParser } from 'nest-csv-parser'
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CrudService {
    constructor(private readonly csvParser: CsvParser,
        private user: User,
        private config: ConfigService) {
    }

    /**
     * 
     * @param append : flag that new data is going to add in exist or not
     * this function help to create csv writer instance with database path set in configaration.
     */
    csvWriterObject(append: boolean): any {
        console.log(this.config.get<string>('database'))
        const csvWriter = createObjectCsvWriter({
            path: `${this.config.get<string>('database')}data.csv`,
            header: this.user.csvHeader(),
            append,
        });
        return csvWriter;
    }    

    /**
     * 
     * @param user : this is payload pass on from controller to save in databases.
     * this function first check email from payload is exist in db or not.
     * if its new only in that case data will be add in csv file.
     */
    async createUser(user: User): Promise<any> {
        const isUserExist = await this.checkUserExist(user.email);
        if (isUserExist.status) {
            return isUserExist;
        }
        try {
            const csvWriter = this.csvWriterObject(true);
            return csvWriter.writeRecords([this.user.setCsvData(user)])
                .then(() => {
                    return {
                        status: true,
                        message: "User inserted Successfully",
                    };
                }).catch((err) => {                    
                    return {
                        status: false,
                        message: err,
                    };
                });
        } catch (err) {
            return {
                status: false,
                message: err,
            };
        }
    }

    /**
     * this return all users list with all details currently present in database
     */
    async getUsers(): Promise<any> {
        try {
            const stream = fs.createReadStream(`${this.config.get<string>('database')}data.csv`);
            const entities: any = await this.csvParser.parse(stream, User, null, null, { separator: ',', mapHeaders: ({ header }) => header.split(' ').join('_') });
            console.log('entities :',entities);
            if (entities) {
                return {
                    status: true,
                    message: entities['list'],
                }
            }
            return {
                status: false,
                message: [],
            }
        } catch (err) {
            return {
                status: false,
                message: err,
            }
        }
    }

    /**
     * 
     * @param id : user id which data need to return in response.
     * function take id as argument in service and return a whole information fro file.
     */
    async getUserById(id: string): Promise<any> {
        const stream = await fs.createReadStream(`${this.config.get<string>('database')}data.csv`);
        try {
            const { list } = await this.csvParser.parse(stream, User, null, null, { separator: ',', mapHeaders: ({ header }) => header.split(' ').join('_') });
            const selectedUser = list.filter((user, index) => {
                if (index === (parseInt(id) - 1)) {
                    return user;
                }
            });
            return {
                status: true,
                message: selectedUser,
            }
        } catch (err) {
            return {
                status: false,
                message: [],
            }
        }
    }

    /**
     * 
     * @param id : user id whose data is going to update.
     * @param updatedUser : new updated payload sent fro user.
     */
    async updateUserById(id: string, updatedUser: User): Promise<any> {
        const stream = await fs.createReadStream(`${this.config.get<string>('database')}data.csv`);
        const { list } = await this.csvParser.parse(stream, User, null, null, { separator: ',', mapHeaders: ({ header }) => header.split(' ').join('_') });
        const updatedUserList = list.map((user, index) => {
            if (index === (parseInt(id) - 1)) {
                return user = this.user.setCsvData(updatedUser)
            } else {
                return user;
            }
        });
        const csvWriter = this.csvWriterObject(false);
        return csvWriter.writeRecords(updatedUserList)
            .then(() => {
                return {
                    status: true,
                    message: "User updated Successfully",
                };
            }).catch((err) => {
                return {
                    status: false,
                    message: err,
                };
            });
    }

    /**
     * 
     * @param id : user id which need to be delete.
     * this function receive id as parameter and delete whole record from database.
     */
    async deleteUserById(id: string): Promise<any> {
        const stream = await fs.createReadStream(`${this.config.get<string>('database')}data.csv`);
        try {
            const { list } = await this.csvParser.parse(stream, User, null, null, { separator: ',', mapHeaders: ({ header }) => header.split(' ').join('_') });
            list.splice(parseInt(id) - 1, 1);
            const csvWriter = this.csvWriterObject(false);
            return csvWriter.writeRecords(list)
                .then((data) => {
                    console.log('data :', data);
                    return {
                        status: true,
                        message: "User deleted Successfully",
                    };
                });
        } catch (err) {
            return {
                status: false,
                message: err,
            };
        }
    }
    
    /**
     * 
     * @param email  : email id of user 
     * this function take email as argument from and
     * check in db whether user is already present in system to avoid duplication
     */
    async checkUserExist(email: string): Promise<any> {
        try {
            const stream = await fs.createReadStream(`${this.config.get<string>('database')}data.csv`);
            const { list } = await this.csvParser.parse(stream, User, null, null, { separator: ',', mapHeaders: ({ header }) => header.split(' ').join('_') });
            const selectedUser = list.filter((user) => {
                console.log(user.Email, '===', email)
                if (user.Email === email) {
                    return user;
                }
            })[0];
            if (selectedUser) {
                return {
                    status: true,
                    message: 'User already exist'
                }
            } else {
                return {
                    status: false,
                }
            }
        } catch (err) {
            return {
                status: false
            }
        }

    }
}
