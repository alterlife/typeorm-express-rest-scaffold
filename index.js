import { BaseEntity } from "typeorm";
import {Request, Response} from "express";


function filterKeys(obj:any, keys:string[], filtered?:any): any {
    if(filtered === undefined) filtered = {}
    for(const key of keys) {
        if(key in obj)
            filtered[key] = obj[key]
    }
    return filtered
}


export class ServiceBuilder {

    static findOne(Model: typeof BaseEntity, params:string[]=["id"])
                : (request:Request, response:Response) => Promise<void> {

        return async (request:Request, response:Response) => {
            const searchParams = {
                ... filterKeys(request.params, params),
                ... filterKeys(request.query, params)
            }

            try {
                response.send(await Model.findOneOrFail(searchParams))
            } catch(e) {
                response.send(404)
            }
            response.end()
        }
    }


    static delete(Model: typeof BaseEntity, params:string[]=["id"])
                : (request:Request, response:Response) => Promise<void> {

        return async (request:Request, response:Response) => {
            const searchParams = {
                ... filterKeys(request.params, params),
                ... filterKeys(request.query, params)
            }

            try {
                response.send(await Model.delete(searchParams))
            } catch(e) {
                response.send(404)
            }
            response.end()
        }
    }

    static findAll(Model: typeof BaseEntity, params?:string[])
                : (request:Request, response:Response) => Promise<void> {
        return async (request:Request, response:Response) => {
            let searchParams = request.params
            if (params!==undefined) {
                searchParams = {
                    ...filterKeys(request.params, params),
                    ...filterKeys(request.query, params)
                }
            }

            try {
                response.send(await Model.find(searchParams))
            } catch(e) {
                response.status(404).send("not found")
            }
        }
    }

    static create(Model: typeof BaseEntity, params?:string[])
                : (request:Request, response:Response) => Promise<void> {
        return async (request:Request, response: Response) => {
            const model = new Model()

            const data = {
                ...filterKeys(request.params, params),
                ...filterKeys(request.query, params)
            }

            for (const param of params) {
                model[param] = data[param]
            }
            try {
                response.send(await Model.save(model))
            } catch(e) {
                response.status(400).send(e.message)
            }
        }
    }

}
