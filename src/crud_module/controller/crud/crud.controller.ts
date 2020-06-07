import { Controller, Get, Post, Body, Res, Put, Param, Delete } from '@nestjs/common';
import { Response } from 'express';

import { User } from '../../data_transfer_object/user_dto';
import { CrudService } from '../../services/crud/crud.service';

@Controller('crud')
export class CrudController {
    constructor(private crudService: CrudService) {

    }

    /**
     * 
     * @param res 
     * @param data
     * this is sets format for final response to user 
     */
    formatResponse(@Res() res: Response, data: { status: boolean, message: any }): any {
        return res.status(200).send(data);
    }

    /**
     * 
     * @param res 
     * this return all users list are in database exists now.
     */
    @Get('/')
    async userList(@Res() res: Response): Promise<any> {
        const response = await this.crudService.getUsers();
        this.formatResponse(res, response);
    }

    /**
     * 
     * @param user : payload coming to api that contain infromation about new user .
     * @param res      
     */
    @Post('/')
    async create(@Body() user: User, @Res() res: Response): Promise<any> {
        const response = await this.crudService.createUser(user);
        this.formatResponse(res, response);
    }

    /**
     * 
     * @param id : this holds id of user to be find to show individual user data.
     * @param res 
     */
    @Get('/:id')
    async getUserbyId(@Param('id') id: string, @Res() res: Response): Promise<any> {
        const response = await this.crudService.getUserById(id);
        this.formatResponse(res, response);
    }

    /**
     * 
     * @param id : this holds user id for updatetion process.
     * @param user : new payload provided to update existing user data.
     * @param res 
     */
    @Put('/:id')
    async updateUser(@Param('id') id: string, @Body() user: User, @Res() res: Response): Promise<any> {
        const response = await this.crudService.updateUserById(id, user);
        this.formatResponse(res, response);

    }

    /**
     * 
     * @param id : holds user id to delete record
     * @param res 
     */
    @Delete('/:id')
    async deleteUserById(@Param('id') id: string, @Res() res: Response): Promise<any> {
        const response = await this.crudService.deleteUserById(id);
        this.formatResponse(res, response);
    }
}
